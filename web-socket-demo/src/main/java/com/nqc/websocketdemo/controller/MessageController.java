package com.nqc.websocketdemo.controller;

import com.nqc.websocketdemo.domain.CustomQueue;
import com.nqc.websocketdemo.domain.OutputMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.List;

@Controller
public class MessageController {

    CustomQueue<OutputMessage> queue = new CustomQueue<>(100);

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public OutputMessage sendMessage(OutputMessage message) throws Exception {
        Date date = new Date();
        message.setDate(date);
        queue.add(message);
        return new OutputMessage(message.getUsername(), message.getMessage(), date);
    }

    @MessageMapping("/history")
    @SendToUser("/queue/history")
    public List<OutputMessage> userHistory(String size) throws Exception {
        return queue.getElement(Integer.valueOf(size));
    }
}
