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
            "prompt": "What is the value of x after executing the JavaScript code?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem1.js",
            "options": {
              "a": "5",
              "b": "6",
              "c": "7",
              "d": "8"
            },
            "answer": "7",
            "difficulty": "medium",
          },
          {
            "number": 2,
            "type":   "multiple-choice",
            "prompt": "What will the above JavaScript code print to the console?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem2.js",
            "options": {
              "a": "'They are the same.'",
              "b": "'They are different.'",
              "c": "Both messages will be printed.",
              "d": "Neither message will be printed."
            },
            "answer": "'They are the same.'",
            "difficulty": "easy",
          },
          {
            "number": 3,
            "type":   "multiple-choice",
            "prompt": "What will the above JavaScript code print to the console?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem3.js",
            "options": {
              "a": "My favorite fruit is banana",
              "b": "My favorite fruit is pear",
              "c": "My favorite fruit is undefined",
              "d": "My favorite fruit is"
            },
            "answer": "My favorite fruit is pear",
            "difficulty": "easy",
          },
          {
            "number": 4,
            "type":   "multiple-choice",
            "prompt": "What will the above JavaScript code print to the console?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem4.js",
            "options": {
              "a": "marker",
              "b": "pen",
              "c": "[\"pencil\", \"pen\", \"marker\"]",
              "d": "undefined"
            },
            "answer": "marker",
            "difficulty": "easy",
          },
          {
            "number": 5,
            "type":   "multiple-choice",
            "prompt": "What will the above JavaScript code print to the console?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem5.js",
            "options": {
              "a": "15",
              "b": "10",
              "c": "4",
              "d": "5"
            },
            "answer": "10",
            "difficulty": "easy",
          },
          {
            "number": 6,
            "type":   "multiple-choice",
            "prompt": "What will the above JavaScript code print to the console?",
            "topic": "JavaScript",
            "codefile": "/assets/code-samples/problem6.js",
            "options": {
              "a": "awesome",
              "b": "fantastic",
              "c": "groovy",
              "d": "It will print both 'awesome' and 'fantastic'"
            },
            "answer": "fantastic",
            "difficulty": "medium"
          },
          {
            "number": 7,
            "type": "text",
            "prompt": "What is your name?",
            "topic": "Information"
          },
          {
            "number": 8,
            "type":   "multiple-choice",
            "prompt": "What shape is the earth?",
            "topic": "Geography",
            "answer": "Round",
            "difficulty": "easy",
            "options": {
              "a": "Round",
              "b": "Square",
              "c": "Triangular",
              "d": "Brown"
            }
          },
          {
            "number": 9,
            "type":   "number",
            "prompt": "How many continents are on earth?",
            "topic": "Geography",
            "answer": "7",
            "difficulty": "easy",
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
