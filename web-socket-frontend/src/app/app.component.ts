import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription} from 'rxjs';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { WebSocketMessage } from './ws-message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'web-socket-frontend';
  messages : WebSocketMessage[] = [];
  sendMessage: string = '';
  topicSubscription!: Subscription;
  queueSubscription!: Subscription;
  stompConfig: InjectableRxStompConfig = new InjectableRxStompConfig();
  username!: string;
  userConnected: boolean = false;

  @ViewChild("chatField") chatField!: ElementRef;
  @ViewChild("scrollDiv") scrollDiv!: ElementRef;

  constructor(private rxStompService: RxStompService, private modalService: NgbModal) {
    this.stompConfig.brokerURL = 'ws://localhost:8080/chat';
    this.stompConfig.heartbeatIncoming = 0;
    this.stompConfig.heartbeatOutgoing = 2000;
    this.stompConfig.reconnectDelay = 200;
    rxStompService.configure(this.stompConfig);
  }

  ngOnInit() {
    this.topicSubscription = this.rxStompService.watch('/topic/messages').subscribe((message: Message) => {
      this.messages.push(JSON.parse(message.body));
      setTimeout(() => {
        this.scrollToBottom();
      },0);
    });
    this.queueSubscription = this.rxStompService.watch('/user/queue/history').subscribe((message: any) => {
      let data: WebSocketMessage[] = JSON.parse(message.body)
      let historyMessage = new WebSocketMessage();
      historyMessage.message = 'HISTORY OF LAST ' + data.length + ' MESSAGE(S)';
      historyMessage.date = new Date();
      historyMessage.username = 'SYSTEM';
      this.messages.push(historyMessage);
      for (let i of data) {
        this.messages.push(i);
      }
      setTimeout(() => {
        this.scrollToBottom();
      },0);
    });
    this.rxStompService.connectionState$.subscribe((state) => {
      if (RxStompState[state] === 'OPEN') {
        this.userConnected = true;
      } else if (RxStompState[state] === 'CLOSING' || RxStompState[state] === 'CLOSED') {
        this.userConnected = false;
      }
    })
  }

  scrollToBottom() {
    this.scrollDiv.nativeElement.scrollTop  = this.scrollDiv.nativeElement.scrollHeight;
  }

  openModal(data: any) {
    this.modalService.open(data);
  }

  closeModal(modal: any) {
    modal.dismiss();
  }

  save(modal: any) {
    modal.close();
    this.connect();
  }

  connect() {
    let connectedMessage = new WebSocketMessage();
    connectedMessage.message = 'CONNECTED WITH USERNAME ' + this.username;
    connectedMessage.date = new Date();
    connectedMessage.username = 'SYSTEM';
    this.rxStompService.activate();
    this.rxStompService.connected$.subscribe(() => {
      this.messages.push(connectedMessage);
    })
  }

  send() {
    if (this.sendMessage !== '') {
      let arr = this.sendMessage.match('history\\s(\\d+)');
      if (arr && parseInt(arr[1]) >= 5 && parseInt(arr[1]) <= 100) {
        this.rxStompService.publish({destination: '/app/history', body: arr[1]});
      } else {
        let message = new WebSocketMessage();
        message.username = this.username;
        message.message = this.sendMessage;
        this.rxStompService.publish({ destination: '/app/send', body: JSON.stringify(message) });
      }
      this.chatField.nativeElement.focus();
      this.sendMessage = '';
    }
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
    this.queueSubscription.unsubscribe();
    this.rxStompService.deactivate();
  }


}
