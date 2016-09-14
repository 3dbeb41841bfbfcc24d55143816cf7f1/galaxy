'use strict';

(function() {

  class ProjectRequirementsController {
    constructor() {
      console.log('ProjectRequirementsController is alive!');
      this.isCollapsed = true;
    }

    // TODO: DRY this up!
    getTotalScore(project) {
      let result = project.requirements.reduce( (sum, r) => {
        return sum += (r.score || r.score === 0) ? r.score : NaN;
      }, 0);
      return isNaN(result) ? 'NA' : result;
    }
  }

  angular.module('galaxyApp')
  .component('projectRequirements', {
    templateUrl: 'app/student/projects/project-requirements.html',
    controller: ProjectRequirementsController,
    bindings: {
      project: '<'
    }
  });

})();
