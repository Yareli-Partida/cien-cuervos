package com.example.ciencuervos.websocket;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebsocketController {
    @MessageMapping("/sala/{id}")
    @SendTo("/topic/messages/{id}")
    public Message send(@DestinationVariable("id") String id, Message message) throws Exception {
        return message;
    }
}
