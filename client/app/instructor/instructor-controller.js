'use strict';

(function() {

  class InstructorController {
    constructor(Auth, $state) {
      console.log('InstructorController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
      this.$state = $state;
    }
  }

  angular.module('galaxyApp')
  .component('instructor', {
    templateUrl: 'app/instructor/instructor.html',
    controller: InstructorController
  });

})();
