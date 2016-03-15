'use strict';

(function() {

  class StudentController {
    constructor(Auth) {
      console.log('StudentController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('student', {
    templateUrl: 'app/student/student.html',
    controller: StudentController
  });

})();
