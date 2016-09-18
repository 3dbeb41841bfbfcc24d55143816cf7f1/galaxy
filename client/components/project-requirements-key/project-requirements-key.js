'use strict';

(function() {

  class ProjectRequirementsKeyController {
    constructor() {
      console.log('ProjectRequirementsKeyController is alive!');
      this.isCollapsed = true;
    }
  }

  angular.module('galaxyApp')
  .component('projectRequirementsKey', {
    templateUrl: 'components/project-requirements-key/project-requirements-key.html',
    controller: ProjectRequirementsKeyController
  });

})();
