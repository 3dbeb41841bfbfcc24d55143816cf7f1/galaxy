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
      let answer = undefined;
      if (this.answer) {
        answer = this.answer;
        console.log('answer:', answer);
        this.checkAnswer(answer);
      }
      else if (!$('input[name=answer]:checked').length) {
        alert('Answer not found in DOM');
      }
      else {
        answer = $('input[name=answer]:checked').val();
        console.log('answer:', answer);
        this.checkAnswer(answer);
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
      this.quizOver = false;
    }
    reset() {
      this.inProgress = false;
    }
  }

  angular.module('galaxyApp')
  .component('quiz', {
    templateUrl: 'app/instructor/quiz/quiz.html',
    controller: QuizController
  });

})();
