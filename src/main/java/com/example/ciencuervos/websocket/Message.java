package com.example.ciencuervos.websocket;

import tools.jackson.databind.JsonNode;

public class Message {
    private JsonNode message;

    public JsonNode getMessage() {
        return message;
    }

    public void setMessage(JsonNode message) {
        this.message = message;
    }
}
