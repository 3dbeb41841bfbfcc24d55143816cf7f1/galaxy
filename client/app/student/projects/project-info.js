'use strict';

(function() {

  class ProjectInfoController {
    constructor($http, Auth) {
      console.log('ProjectInfoController is alive!');
      this.$http = $http;
      this.getCurrentUser = Auth.getCurrentUser;
    }

    getBaseProjectUrl() {
      return '/api/users/' + this.getCurrentUser()._id + '/projects/';
    }

    update(project) {
      this.$http.put(this.getBaseProjectUrl() + project._id, project)
      .then(response => {
        this.getCurrentUser().projects = response.data;
      });
    }

    updateNumber(project, num) {
      project.num = num;
      this.update(project);
    }

    updateTitle(project, title) {
      project.title = title;
      this.update(project);
    }

    updateInfo(project, info) {
      project.info = info;
      this.update(project);
    }

    updateGithubUrl(project, url) {
      project.gitHubUrl = url;
      this.update(project);
    }

    updateDeploymentUrl(project, url) {
      project.deploymentUrl = url;
      this.update(project);
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
    templateUrl: 'app/student/projects/project-info.html',
    controller: ProjectInfoController,
    bindings: {
      project: '<'
    }
  });

})();
