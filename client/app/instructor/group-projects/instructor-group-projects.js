'use strict';

(function() {

  class InstructorGroupProjectsController {
    constructor($http, Cohort, $filter, $rootScope) {
      console.log('InstructorGroupProjectsController is alive!');
      this.$http = $http;
      this.Cohort = Cohort;
      this.$filter = $filter;

      this.groupProjects = [];
      this.loadGroupProjects();

      this.cohorts = [];

      $rootScope.$on('cohortChangeEvent', () => {
        this.loadGroupProjects();
      });

      // This is used in the drag and drop control when editing a
      // groupProject's team.
      this.teamMembers = {
        selected: null,
        lists: {"Available": [], "Assigned": []}
      };

      // this object is used as a delegate for the `project-info` component
      this.groupProjectUpdater = {
        update: groupProject => {
          console.log('=== you reached the delegated update of a groupProject ===');
          this.$http.put('/api/group-projects/' + groupProject._id, groupProject)
          .then(response => {
            this.loadGroupProjects();
          });
        }
      };

      this.groupProjectRequirementsUpdater = {
        update: (student, saveable, requirement) => {
          console.log('=== you reached the delegated update of a groupProject requirement ===');
          var url = '/api/group-projects/' + saveable._id + '/requirements/' + requirement._id;
          this.$http.put(url, requirement)
          .then(response => {
            console.log('updated groupProject:', response.data);
            // TODO???
            // project.requirements.findById(requirement._id) = response.data;
          });
        }
      };
    }

    getStudentsForCohort(cohort) {
      let cohortId = undefined;
      if (cohort) {
        cohortId = cohort._id ? cohort._id : cohort;
      }
      else if (this.Cohort.getCurrentCohort()) {
        cohortId = this.Cohort.getCurrentCohort()._id;
      }
      return this.$http.get('/api/users', { params: { role: 'student', cohort: cohortId } } );
    }

    loadGroupProjects() {
      let theCohort = this.Cohort.getCurrentCohort();
      let cohortId = theCohort ? theCohort._id : undefined;
      return this.$http.get('/api/group-projects', { params: { cohort: cohortId } })
      .then( res => {
        this.groupProjects = res.data;
      });
    }

    updateName(groupProject, name) {
      groupProject.name = name;
      this.groupProjectUpdater.update(groupProject);
    }

    containsStudent(list, student) {
      return list.filter( item => item._id === student._id ).length > 0;
    }

    goTeamEditMode(groupProject) {
      // populate available and assigned lists
      this.teamMembers.lists.Available.length = 0;
      this.teamMembers.lists.Assigned.length = 0;

      this.getStudentsForCohort(groupProject.cohort)
      .then((response) => {
        let students = response.data;
        // console.log('allStudents 2:', students.map( student => { return { name: student.name }; } ));
        students.forEach( student => {
          if (!this.containsStudent(groupProject.team, student)) {
            this.teamMembers.lists.Available.push(student);
          }
        });
      });

      groupProject.team.forEach( teamMember => {
        this.teamMembers.lists.Assigned.push(teamMember);
      });

      groupProject.teamEditMode = true;
    }

    cancelTeamEditMode(groupProject) {
      groupProject.teamEditMode = false;
    }

    saveTeamUpdates(index, groupProject) {
      // TODO: save team updates to groupProject
      groupProject.team = this.teamMembers.lists.Assigned.map( member => member._id );
      this.$http.put('/api/group-projects/' + groupProject._id, groupProject)
      .then( res => {
        this.groupProjects[index] = res.data;
        this.cancelTeamEditMode(groupProject);
      });
    }

    getUserLabel(user) {
      return user.name ? user.name : user.email;
      // return `${user.name} ( ${user.email} )`;
    }

    newGroupProject() {
      let currentCohort = this.Cohort.getCurrentCohort();
      let cohortId = currentCohort ? currentCohort._id : undefined;

      let newGroupProject = {
        name: 'New Group Project',
        cohort: cohortId,
        project: {
          num: 3,
          title: 'title goes here',
          info: 'info goes here',
          githubUrl: 'githubUrl goes here',
          deploymentUrl: 'deploymentUrl goes here'
        },
        team: []
      };
      this.$http.post('/api/group-projects', newGroupProject)
      .then(response => {
        console.log('Created new Group Project:', response.data);
        this.loadGroupProjects();
      });
    }

    updateGroupProjectCohort(groupProject, cohort) {
      if (!cohort) {
        return;
      }
      return this.$http.put('/api/group-projects/' + groupProject._id + '/cohort',
                            { cohort: cohort._id }
                           )
      .then(() => {
        console.log('groupProject updated with new cohort.');
      });
    }


    // TODO: handle newly created cohorts
    loadCohorts(groupProject) {
      if (this.cohorts.length) {
        this.setCohortInVM(groupProject, groupProject.cohort);
        return null;
      }
      else {
        return this.$http.get('/api/cohorts')
        .then((response) => {
          this.cohorts = response.data;
          this.setCohortInVM(groupProject, groupProject.cohort);
        });
      }
    }

    // This is needed to sync the xeditable select options with the
    // groupProject's currently set cohort object
    setCohortInVM(groupProject, cohort) {
      if (!cohort) {
        return;
      }
      var selected = this.$filter('filter')(this.cohorts, {_id: cohort._id} );
      groupProject.cohort = selected.length ? selected[0] : null;
    }

    deleteProject(groupProject) {
      if (confirm('Are you sure?')) {
        this.$http.delete('/api/group-projects/' + groupProject._id)
        .then(response => {
          this.loadGroupProjects();
        });
      }
    }
  }

  angular.module('galaxyApp')
  .component('instructorProjects', {
    templateUrl: 'app/instructor/group-projects/instructor-group-projects.html',
    controller: InstructorGroupProjectsController
  });

})();
