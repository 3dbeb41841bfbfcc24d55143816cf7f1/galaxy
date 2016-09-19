'use strict';

(function() {

  class ProjectRequirementsEditorController {
    constructor() {
      console.log('ProjectRequirementsEditorController is alive!');
      this.isCollapsed = true;

      console.log('student:', this.student);
      console.log('project:', this.project);
      console.log('saveable:', this.saveable);
      console.log('updater:', this.updater);
    }

    updateScore(requirement, score) {
      requirement.score = score;
      this.updater.update(this.student, this.saveable, requirement);
    }

    updateComments(requirement, comments) {
      requirement.comments = comments;
      this.updater.update(this.student, this.saveable, requirement);
    }

    zeroForNull(obj, prop) {
      console.log('zeroForNull:', obj[prop]);
      if (obj[prop] === null) {
        obj[prop] = 0;
      }
    }
  }

  angular.module('galaxyApp')
  .component('projectRequirementsEditor', {
    templateUrl: 'components/project-requirements-editor/project-requirements-editor.html',
    controller: ProjectRequirementsEditorController,
    bindings: {
      student: '<',
      project: '<',
      saveable: '<',
      updater: '<'
    }
  });

})();
