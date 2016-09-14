'use strict';

(function() {

  class StudentProjectsController {
    constructor($http, Auth) {
      console.log('StudentProjectsController is alive!');
      this.$http = $http;
      this.getCurrentUser = Auth.getCurrentUser;
    }

    getBaseProjectUrl() {
      return '/api/users/' + this.getCurrentUser()._id + '/projects/';
    }

    addProject() {
      let num = this.getCurrentUser().projects.reduce(function(max, next) {
        return Math.max(max, next.num);
      }, 0) + 1;

      let newProject = {
        num: num,
        title: 'title goes here',
        info: 'info goes here',
        githubUrl: 'githubUrl goes here',
        deploymentUrl: 'deploymentUrl goes here'
      };

      this.$http.post(this.getBaseProjectUrl(), newProject)
      .then(response => {
        this.getCurrentUser().projects.push(response.data);
      });
    }

    deleteProject(project) {
      if (confirm('Are you sure?')) {
        this.$http.delete(this.getBaseProjectUrl() + project._id)
        .then(response => {
          this.getCurrentUser().projects = response.data;
        });
      }
    }
  }

  angular.module('galaxyApp')
  .component('studentProjects', {
    templateUrl: 'app/student/projects/student-projects.html',
    controller: StudentProjectsController
  });

})();
