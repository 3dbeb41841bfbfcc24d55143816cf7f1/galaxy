'use strict';

(function() {
  class StudentProfilesController {
    constructor(Auth, Cohort, Squad, appConfig, $http, $filter, $rootScope) {
      console.log('StudentProfilesController is alive!');
      this.pageTitle = 'Student Profiles';
      this.Auth = Auth;
      this.Cohort = Cohort;
      this.Squad = Squad;
      this.roles = appConfig.userRoles;
      this.$http = $http;
      this.$filter = $filter;

      this.loadStudents();
      this.cohorts = [];
      this.squads = [];

      this.projectsIsCollapsed = true;

      $rootScope.$on('cohortChangeEvent', () => {
        this.loadStudents();
      });
      $rootScope.$on('squadChangeEvent', () => {
        this.loadStudents();
      });
    }

    get squad() {
      return this.Squad.getCurrentSquad();
    }

    isStudent() {
      return this.Auth.getCurrentUser().role === 'student';
    }

    loadStudents() {
      this.Auth.getCurrentUser(currentUser => {
        // TODO: DRY this up
        let theCohort = currentUser.role === 'student' ? currentUser.cohort : this.Cohort.getCurrentCohort();
        let theSquad  = this.squad;
        let cohortId = theCohort ? theCohort._id : undefined;
        let squadId = theSquad ? theSquad._id : undefined;
        return this.$http.get('/api/users',
                              { params: {
                                         role: 'student',
                                         cohort: cohortId,
                                         squad: squadId }
        })
        .then(response => {
          this.students = response.data;
        });
      });
    }

    // TODO: handle newly created cohorts
    loadCohorts(user) {
      if (this.cohorts.length) {
        this.setCohortInVM(user, user.cohort);
        return null;
      }
      else {
        return this.$http.get('/api/cohorts')
        .then((response) => {
          this.cohorts = response.data;
          this.setCohortInVM(user, user.cohort);
        });
      }
    }

    // TODO: handle newly created squads
    loadSquads(user) {
      if (this.squads.length) {
        this.setSquadInVM(user, user.squad);
        return null;
      }
      else {
        return this.$http.get('/api/squads')
        .then((response) => {
          this.squads = response.data;
          this.setSquadInVM(user, user.squad);
        });
      }
    }

    setCohortInVM(user, cohort) {
      if (!cohort) {
        return;
      }
      var selected = this.$filter('filter')(this.cohorts, {_id: cohort._id} );
      user.cohort = selected.length ? selected[0] : null;
    }

    setSquadInVM(user, squad) {
      if (!squad) {
        return;
      }
      var selected = this.$filter('filter')(this.squads, {_id: squad._id} );
      user.squad = selected.length ? selected[0] : null;
    }

    getAttendancePresentOrLate(user) {
      var presentOrLate = 0;
      user.attendance.forEach((a) => {
        if (a.value === 'present' || a.value === 'late') {
          ++presentOrLate;
        }
      });
      return presentOrLate;
    }

    getAttendancePercentage(user) {
      var total = user.attendance.length;
      return total === 0 ? 0.0 : this.getAttendancePresentOrLate(user) * 100.0 / total;
    }

    getTotalProjectScore(project) {
      var result = project.requirements.reduce(function(sum, r) {
        return sum += (r.score || r.score === 0) ? r.score : NaN;
      }, 0);
      return isNaN(result) ? 'NA' : result;
    }

    updateProject(user, project) {
      var url = '/api/users/' + user._id + '/projects/' + project._id;
      this.$http.put(url, project)
      .then(response => {
        // TODO???
        // user.projects.findById(project._id) = response.data;
      });
    }

    updateProjectComments(user, project, comments) {
      project.comments = comments;
      this.updateProject(user, project);
    }

    updateProjectRequirement(user, project, requirement) {
      var url = '/api/users/' + user._id + '/projects/' + project._id + '/requirements/' + requirement._id;
      this.$http.put(url, requirement)
      .then(response => {
        // TODO???
        // project.requirements.findById(requirement._id) = response.data;
      });
    }

    updateProjectRequirementScore(user, project, requirement, score) {
      requirement.score = score;
      this.updateProjectRequirement(user, project, requirement);
    }

    updateProjectRequirementComments(user, project, requirement, comments) {
      requirement.comments = comments;
      this.updateProjectRequirement(user, project, requirement);
    }
  }

  class MySquadController extends StudentProfilesController {
    constructor(Auth, Cohort, Squad, appConfig, $http, $filter, $rootScope) {
      super(Auth, Cohort, Squad, appConfig, $http, $filter, $rootScope);
      this.pageTitle = 'My Squad';
    }

    get squad() {
      let currentUser = this.Auth.getCurrentUser();
      return currentUser.squad;
    }
  }

  angular.module('galaxyApp')
  .component('studentProfiles', {
    templateUrl: 'app/instructor/student-profiles/student-profiles.html',
    controller: StudentProfilesController
  });

  angular.module('galaxyApp')
  .component('studentMySquad', {
    templateUrl: 'app/instructor/student-profiles/student-profiles.html',
    controller: MySquadController
  });

})();
