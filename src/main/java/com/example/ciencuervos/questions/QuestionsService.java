package com.example.ciencuervos.questions;

import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.io.File;


@Service
public class QuestionsService {

    private static ObjectMapper mapper = new ObjectMapper();
    private static ObjectNode questions = mapper.createObjectNode();

    public void readAllQuestions() {
        JsonNode questionsTree = mapper.readTree(new File("C:/Users/Yarel/IdeaProjects/cien-cuervos/src/main/resources/static/data/data.json"));
        if (questionsTree != null) {
            questions = (ObjectNode) questionsTree;
        }
    }

    public JsonNode getQuestionById(String id) {
        if (questions.isEmpty()) {
            readAllQuestions();
        }

        return questions.get(id);
    }

    public JsonNode getAllQuestions() {
        if (questions.isEmpty()) {
            readAllQuestions();
        }
        return questions;
    }
}
