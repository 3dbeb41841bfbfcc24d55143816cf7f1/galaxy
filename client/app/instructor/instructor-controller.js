'use strict';

(function() {

  class InstructorController {
    constructor(Auth) {
      console.log('InstructorController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('instructor', {
    templateUrl: 'app/instructor/instructor.html',
    controller: InstructorController
  });

})();
