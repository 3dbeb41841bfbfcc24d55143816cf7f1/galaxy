'use strict';

(function() {

  class ProjectInfoController {
    constructor() {
      console.log('ProjectInfoController is alive!');
      console.log('this:', this);
    }

    updateNumber(project, num) {
      project.num = num;
      console.log('about to call this.update:', this.update);
      this.updater.update(this.saveable);
    }

    updateTitle(project, title) {
      project.title = title;
      this.updater.update(this.saveable);
    }

    updateInfo(project, info) {
      project.info = info;
      this.updater.update(this.saveable);
    }

    updateGithubUrl(project, url) {
      project.gitHubUrl = url;
      this.updater.update(this.saveable);
    }

    updateDeploymentUrl(project, url) {
      project.deploymentUrl = url;
      this.updater.update(this.saveable);
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
  .component('projectInfo', {
    templateUrl: 'components/project-info/project-info.html',
    controller: ProjectInfoController,
    bindings: {
      project: '<',
      saveable: '<',
      updater: '<'
    }
  });

})();
