'use strict';

(function() {

  class UserAdminController {
    constructor(Cohort, Squad, appConfig, $http, $filter, $rootScope) {
      this.Cohort = Cohort;
      this.Squad  = Squad;
      this.$http = $http;
      this.$filter = $filter;
      // Use the User $resource to fetch all users
      // this.users = User.query();
      this.users = [];
      this.loadUsers();

      this.roles = appConfig.userRoles;

      this.cohorts = [];
      this.squads = [];

      $rootScope.$on('cohortChangeEvent', () => {
        this.loadUsers();
      });
      $rootScope.$on('squadChangeEvent', () => {
        this.loadUsers();
      });
    }

    loadUsers() {
      // TODO: DRY this up
      let theCohort = this.Cohort.getCurrentCohort();
      let theSquad  = this.Squad.getCurrentSquad();
      let cohortId = theCohort ? theCohort._id : undefined;
      let squadId = theSquad ? theSquad._id : undefined;
      return this.$http.get('/api/users',
                            { params: {
                                       // TODO: use angular filter for role
                                       // role: 'student',
                                       cohort: cohortId,
                                       squad: squadId }
      })
      .then((response) => {
        this.users = response.data;
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

    // This is needed to sync the xeditable select options with the user's
    // currently set cohort object
    setCohortInVM(user, cohort) {
      if (!cohort) {
        return;
      }
      var selected = this.$filter('filter')(this.cohorts, {_id: cohort._id} );
      user.cohort = selected.length ? selected[0] : null;
    }

    // This is needed to sync the xeditable select options with the user's
    // currently set squad object
    setSquadInVM(user, squad) {
      if (!squad) {
        return;
      }
      var selected = this.$filter('filter')(this.squads, {_id: squad._id} );
      user.squad = selected.length ? selected[0] : null;
    }

    updateRole(user, role) {
      return this.$http.put('/api/users/' + user._id + '/role', { role: role } );
    }

    updateCohort(user, cohort) {
      if (!cohort) {
        return;
      }
      return this.$http.put('/api/users/' + user._id + '/cohort',
                            { cohort: cohort._id }
                           )
      .then(() => {
        this.setCohortInVM(user, cohort);
      });
    }

    updateSquad(user, squad) {
      if (!squad) {
        return;
      }
      return this.$http.put('/api/users/' + user._id + '/squad',
                            { squad: squad._id }
                           )
      .then(() => {
        this.setSquadInVM(user, squad);
      });
    }

    // TODO: start of copy paste from student-profiles-controller.js
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
    // TODO: end of copy paste from student-profiles-controller.js

    delete(user) {
      if (confirm('Are you sure?')) {
        this.$http.delete('/api/users/' + user._id)
        .then(() => {
          this.users.splice(this.users.indexOf(user), 1);
        });
      }
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminUsers', {
    templateUrl: 'app/admin/users/user-admin.html',
    controller: UserAdminController
  });

})();
