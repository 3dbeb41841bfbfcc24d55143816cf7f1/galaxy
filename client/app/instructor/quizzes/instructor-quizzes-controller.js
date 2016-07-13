'use strict';

(function() {

  class InstructorQuizzesController {
    constructor() {
      console.log('InstructorQuizzesController is alive!');
    }
  }

  angular.module('galaxyApp')
  .component('instructorQuizzes', {
    templateUrl: 'app/instructor/quizzes/instructor-quizzes.html',
    controller: InstructorQuizzesController
  });

})();
