'use strict';

(function() {

  class InstructorGroupProjectsController {
    constructor($http, Cohort) {
      console.log('InstructorGroupProjectsController is alive!');
      this.$http = $http;
      this.Cohort = Cohort;
      this.editMode = false;

      this.groupProjects = [];
      this.getGroupProjects();

      this.teamMembers = {
        selected: null,
        lists: {"Available": [], "Assigned": []}
      };
    }

    getAllStudents() {
      let currentCohort = this.Cohort.getCurrentCohort();
      let cohortId = currentCohort ? currentCohort._id : undefined;
      return this.$http.get('/api/users', { params: { role: 'student', cohort: cohortId } } );
    }

    getGroupProjects() {
      this.$http.get('/api/group-projects')
      .then( res => {
        this.groupProjects = res.data;
      });
    }

    containsStudent(list, student) {
      return list.filter( item => item._id === student._id ).length > 0;
    }

    goTeamEditMode(groupProject) {
      // populate available and assigned lists
      this.teamMembers.lists.Available.length = 0;
      this.teamMembers.lists.Assigned.length = 0;

      this.getAllStudents()
      .then((response) => {
        this.allStudents = response.data;
        console.log('allStudents 1:', JSON.stringify(this.allStudents));
        console.log('allStudents 2:', this.allStudents.map( student => { return { name: student.name }; } ));
        this.allStudents.forEach( student => {
          if (!this.containsStudent(groupProject.team, student)) {
            this.teamMembers.lists.Available.push(student);
          }
        });
      });

      groupProject.team.forEach( teamMember => {
        this.teamMembers.lists.Assigned.push(teamMember);
      });

      this.editMode = true;
    }

    cancelTeamEditMode() {
      this.editMode = false;
    }

    goSaveTeamUpdates(groupProject) {
      // TODO: save team updates to groupProject
      this.editMode = false;
    }

    getUserLabel(user) {
      return user.name ? user.name : user.email;
      // return `${user.name} ( ${user.email} )`;
    }
  }

  angular.module('galaxyApp')
  .component('instructorProjects', {
    templateUrl: 'app/instructor/group-projects/instructor-group-projects.html',
    controller: InstructorGroupProjectsController
  });

})();
