'use strict';

(function() {

  class StudentProjectsController {
    constructor($http, Auth) {
      console.log('StudentProjectsController is alive!');
      this.$http = $http;
      this.getCurrentUser = Auth.getCurrentUser;

      // this object is used as a delegate for the `project-info` component
      this.projectUpdater = {
        update: project => {
          console.log('=== you reached the delegated update of a project ===');
          this.$http.put(this.getBaseProjectUrl() + project._id, project)
          .then(response => {
            this.getCurrentUser().projects = response.data;
          });
        }
      };

      // this object is used as a delegate for the `project-info` component
      this.groupProjectUpdater = {
        update: groupProject => {
          console.log('=== you reached the delegated update of a groupProject ===');
          this.$http.put('/api/group-projects/' + groupProject._id, groupProject)
          .then(response => {
            this.$http.get(this.getBaseProjectUrl())
            .then( res => {
              console.log('res.data:', res.data);
              this.getCurrentUser().projects = res.data.projects;
              this.getCurrentUser().groupProjects = res.data.groupProjects;
            });
          });
        }
      };
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
