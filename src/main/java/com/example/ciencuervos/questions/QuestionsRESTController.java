package com.example.ciencuervos.questions;

import netscape.javascript.JSObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QuestionsRESTController {

    private QuestionsService questionsService = new QuestionsService();

    @GetMapping("/get-question-by-id")
    public String getQuestionById(@RequestParam String id) {
        return questionsService.getQuestionById(id).toString();
    }

    @GetMapping("/get-all-questions")
    public String getAllQuestions() {
        return questionsService.getAllQuestions().toString();
    }
}
