'use strict';

(function() {

  class QuizController {
    constructor(QuizService) {
      console.log('QuizController is alive!');
      this.quizService = QuizService;
      this.reset();
    }
    quizName() {
      return this.quizService.quizName();
    }
    nextQuestion() {
      this.question = this.quizService.getQuestion(++this.questionNumber);
      if (!this.question) {
        this.quizOver = true;
      }
    }
    checkAnswer(answer) {
      if (this.question.answer) {
        ++this.numGraded;
        if (this.quizService.checkAnswer(this.question.number, answer)) {
          console.log('CORRECT!');
          ++this.numCorrect;
        }
        else {
          console.log('WRONG!');
        }
      }
    }
    currentQuestionNumber() {
      return this.question ? this.question.number : this.numQuestions() + 1;
    }
    questionsCompleted() {
      return this.currentQuestionNumber() - 1;
    }
    numQuestions() {
      return this.quizService.numQuestions();
    }
    getProgress() {
      return 50;
    }
    submit() {
      let answer;
      if (this.answer) {
        answer = this.answer;
        console.log('answer:', answer);
        this.checkAnswer(answer);
      }
      else {
        alert('Answer not found in DOM');
      }
      this.answer = undefined;
      this.nextQuestion();
    }
    startQuiz() {
      console.log('startQuiz');
      this.inProgress = true;
      this.questionNumber = 0;
      this.numCorrect = 0;
      this.numGraded = 0;
      this.nextQuestion();
    }
    reset() {
      this.inProgress = false;
      this.quizOver = false;
    }
  }

  angular.module('galaxyApp')
  .component('quiz', {
    templateUrl: 'app/instructor/quiz/quiz.html',
    controller: QuizController
  });

})();
