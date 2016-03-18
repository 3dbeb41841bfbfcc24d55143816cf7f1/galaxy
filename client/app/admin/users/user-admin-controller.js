'use strict';

(function() {

  class UserAdminController {
    constructor(User, appConfig, $http, $filter) {
      // Use the User $resource to fetch all users
      this.users = User.query();
      this.roles = appConfig.userRoles;
      this.cohorts = [];
      this.squads = [];
      this.$http = $http;
      this.$filter = $filter;
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

    delete(user) {
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminUsers', {
    templateUrl: 'app/admin/users/user-admin.html',
    controller: UserAdminController
  });

})();
