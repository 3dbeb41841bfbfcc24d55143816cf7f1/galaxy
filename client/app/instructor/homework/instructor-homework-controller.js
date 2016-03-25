'use strict';

(function() {

  class InstructorHomeworkController {
    constructor() {
      console.log('InstructorHomeworkController is alive!');
    }
  }

  angular.module('galaxyApp')
  .component('instructorHomework', {
    templateUrl: 'app/instructor/homework/instructor-homework.html',
    controller: InstructorHomeworkController
  });

})();
