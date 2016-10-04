'use strict';

(function() {

  class InstructorResourcesController {
    constructor() {
      console.log('InstructorResourcesController is alive!');
    }
  }

  angular.module('galaxyApp')
  .component('instructorResources', {
    templateUrl: 'app/instructor/resources/instructor-resources.html',
    controller: InstructorResourcesController
  });

})();
