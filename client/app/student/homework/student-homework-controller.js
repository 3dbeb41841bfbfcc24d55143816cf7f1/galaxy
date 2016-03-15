'use strict';

(function() {

  class StudentHomeworkController {
    constructor(Auth) {
      console.log('StudentHomeworkController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('studentHomework', {
    templateUrl: 'app/student/homework/student-homework.html',
    controller: StudentHomeworkController
  });

})();
