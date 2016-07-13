'use strict';

(function() {
  class QuizService {
    constructor() {
      this.quiz = {
        "id": "example-quiz",
        "name": "Example Quiz",
        "questions": [
          {
            "number": 1,
            "type":   "multiple-choice",
            "prompt": "What is the value of x after the following JavaScript code executes?",
            "codefile": "/assets/code-samples/problem1-js",
            "options": {
              "a": "5",
              "b": "6",
              "c": "7",
              "d": "8"
            },
            "answer": "7"
          },
          {
            "number": 2,
            "type": "text",
            "prompt": "What is your name?"
          },
          {
            "number": 3,
            "type": "checkboxes",
            "prompt": "Check all that apply:",
            "options": {
              "bike": "I have a bike",
              "car": "I have a car",
              "boat": "I have a boat",
              "plane": "I have a plane"
            }
          },
          {
            "number": 4,
            "type":   "multiple-choice",
            "prompt": "What shape is the earth?",
            "answer": "Round",
            "options": {
              "a": "Round",
              "b": "Square",
              "c": "Triangular",
              "d": "Brown"
            }
          },
          {
            "number": 5,
            "type":   "number",
            "prompt": "How many continents are on earth?",
            "answer": "7"
          }
        ]
      };
    }
    quizName() {
      return this.quiz.name;
    }
    getQuestion(num) {
      return _.find(this.quiz.questions, question => { return question.number === num; });
    }
    checkAnswer(num, answer) {
      let question = this.getQuestion(num);
      console.log('checkAnswer: Does ', answer, ' == ', question['answer']);
      return question ? question.answer == answer : false;
    }
    numQuestions() {
      return this.quiz.questions.length;
    }
  }

  angular.module('galaxyApp')
    .service('QuizService', QuizService);
})();
