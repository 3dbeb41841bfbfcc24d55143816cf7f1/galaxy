'use strict';

(function() {

  class InstructorProjectsController {
    constructor() {
      console.log('InstructorProjectsController is alive!');
    }
  }

  angular.module('galaxyApp')
  .component('instructorProjects', {
    templateUrl: 'app/instructor/projects/instructor-projects.html',
    controller: InstructorProjectsController
  });

})();
