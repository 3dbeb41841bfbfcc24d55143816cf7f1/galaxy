'use strict';

(function() {

  class StudentController {
    constructor(Auth, $state) {
      console.log('StudentController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
      this.$state = $state;
    }
  }

  angular.module('galaxyApp')
  .component('student', {
    templateUrl: 'app/student/student.html',
    controller: StudentController
  });

})();
