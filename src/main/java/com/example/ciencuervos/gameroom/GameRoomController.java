package com.example.ciencuervos.gameroom;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameRoomController {

    @GetMapping("/gameroom")
    public String gameRoom() {
        return "gameroom";
    }
}
