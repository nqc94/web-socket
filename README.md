# web-socket
Web Socket demo with Java + Spring Boot + Angular

To run back-end:
1) go to the directory web-socket-demo
2) run the command 'docker build -t <name:tag> .'
3) run the command 'docker run -p 8080:8080 <name:tag>'

To run front-end:
1) go to the directory web-socket-frontend
2) run the command 'docker build -t <name:tag> .'
3) run the command 'docker run -p 80:80 <name:tag>'

After both back-end and front-end is started, access the app using http://localhost:80/

How to use:
1) Click the 'CONNECT' button and input your username.
2) Input your message in the textbox and click 'SEND' or press Enter to send your message.
3) Type history N, where N is any number from 5-100 to get the last N messages.
