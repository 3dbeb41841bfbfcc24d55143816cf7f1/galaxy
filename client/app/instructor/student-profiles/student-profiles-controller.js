'use strict';

(function() {

  class StudentProfilesController {
    constructor(Cohort, appConfig, $http, $filter, $rootScope) {
      console.log('StudentProfilesController is alive!');

      this.Cohort = Cohort;
      this.roles = appConfig.userRoles;
      this.$http = $http;
      this.$filter = $filter;

      this.loadStudents();
      this.cohorts = [];
      this.squads = [];

      $rootScope.$on('cohortChangeEvent', () => {
        this.loadStudents();
      });
    }

    loadStudents() {
      this.Cohort.getUsers('student')
      .then(response => {
        this.students = response.data;
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

    getAttendancePercentage(user) {
      var present = 0;
      var total = 0;
      user.attendance.forEach((a) => {
        if (a.value === 'present' || a.value === 'late') {
          ++present;
        }
        if (a.value) {
          ++total;
        }
      });
      if (total === 0) {
        return 0;
      }
      return present * 100.0 / total;
    }
  }

  angular.module('galaxyApp')
  .component('studentProfiles', {
    templateUrl: 'app/instructor/student-profiles/student-profiles.html',
    controller: StudentProfilesController
  });

})();
