package com.example.ciencuervos.questions;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QuestionsRESTController {

    private QuestionsService questionsService = new QuestionsService();

    @GetMapping("/get-question-data")
    public String getQuestionData(@RequestParam String id) {
        return questionsService.getQuestionById(id).toString();
    }
}
