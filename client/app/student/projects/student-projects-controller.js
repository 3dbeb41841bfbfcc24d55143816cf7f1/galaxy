'use strict';

(function() {

  class StudentProjectsController {
    constructor($http, Auth) {
      console.log('StudentProjectsController is alive!');
      this.$http = $http;
      this.getCurrentUser = Auth.getCurrentUser;

      // TODO:
      // this.projects = this.getCurrentUser().projects
      this.projects = [
        {
          _id: 1,
          title: 'first project',
          info: 'my first project',
          num: 1,
          githubUrl: 'https://www.github.com/drmikeh/project1',
          deploymentUrl: 'http://bitballoon.com/project1'
        },
        {
          _id: 2,
          title: 'second project',
          info: 'my second project',
          num: 2,
          githubUrl: 'https://www.github.com/drmikeh/project2',
          deploymentUrl: 'http://bitballoon.com/project2'
        }
      ];
    }

    addProject() {
      this.inserted = {
        name: '',
        info: null,
        startDate: null,
        active: true
      };
      this.projects.push(this.inserted);
    }

    enrichProject(project, index) {
      this.projects[index] = project;
    }

    saveProject(index, data, id) {
      if (id) {
        data._id = id;
        // TODO:
        this.Project.save(data)
        .then(response => {
          this.enrichProject(response.data, index);
        });
      }
      else {
        alert('TODO: save project');
        // TODO:
        // this.Project.save(data)
        // .then(response => {
        //   this.enrichProject(response.data, index);
        // });
      }
    }

    removeProject(index, project) {
      if (confirm('Are you sure?')) {
        // TODO:
        this.Project.remove(project)
        .then(() => {
          console.log('project deleted');
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
