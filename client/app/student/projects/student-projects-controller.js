'use strict';

(function() {

  class StudentProjectsController {
    constructor($http, Auth) {
      console.log('StudentProjectsController is alive!');
      this.$http = $http;
      this.getCurrentUser = Auth.getCurrentUser;
      this.baseProjectUrl = '/api/users/' + this.getCurrentUser()._id + '/projects/';

      // TODO: improve this?
      this.projects = this.getCurrentUser().projects
    }

    addProject() {
      let num = this.projects.reduce(function(max, next) {
        return Math.max(max, next.num);
      }, 0) + 1;

      let newProject = {
        num: num,
        title: 'title goes here',
        info: 'info goes here',
        githubUrl: 'githubUrl goes here',
        deploymentUrl: 'deploymentUrl goes here'
      };

      this.$http.post(this.baseProjectUrl, newProject)
      .then(response => {
        this.projects.push(response.data);
      });
    }

    update(project) {
      this.$http.put(this.baseProjectUrl + project._id, project)
      .then(response => {
        this.projects = response.data;
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

    deleteProject(project) {
      if (confirm('Are you sure?')) {
        this.$http.delete(this.baseProjectUrl + project._id)
        .then(response => {
          this.projects = response.data;
        });
      }
    }

    getTotalScore(project) {
      var result = project.requirements.reduce(function(sum, r) {
        return sum += (r.score || r.score === 0) ? r.score : NaN;
      }, 0);
      return isNaN(result) ? 'NA' : result;
    }
  }

  angular.module('galaxyApp')
  .component('studentProjects', {
    templateUrl: 'app/student/projects/student-projects.html',
    controller: StudentProjectsController
  });

})();
