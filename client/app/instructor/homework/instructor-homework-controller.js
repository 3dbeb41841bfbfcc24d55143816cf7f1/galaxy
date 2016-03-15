'use strict';

(function() {

  class InstructorHomeworkController {
    constructor(Auth) {
      console.log('InstructorHomeworkController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('instructorHomework', {
    templateUrl: 'app/instructor/homework/instructor-homework.html',
    controller: InstructorHomeworkController
  });

})();
