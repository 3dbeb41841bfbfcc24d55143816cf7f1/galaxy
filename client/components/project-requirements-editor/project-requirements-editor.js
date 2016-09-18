'use strict';

(function() {

  class ProjectRequirementsEditorController {
    constructor() {
      console.log('ProjectRequirementsEditorController is alive!');
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
  .component('projectRequirementsEditor', {
    templateUrl: 'components/project-requirements-editor/project-requirements-editor.html',
    controller: ProjectRequirementsEditorController,
    bindings: {
      project: '<'
    }
  });

})();
