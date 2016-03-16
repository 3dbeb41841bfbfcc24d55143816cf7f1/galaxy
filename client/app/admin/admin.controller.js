'use strict';

(function() {

class AdminController {
  constructor(User, appConfig, $http, $filter) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.roles = appConfig.userRoles;
    this.cohorts = [];
    this.$http = $http;
    this.$filter = $filter;
  }

  // TODO: handle newly created cohorts
  loadCohorts() {
    return this.cohorts.length ? null : this.$http.get('/api/cohorts')
    .then((response) => {
      console.log('we have cohorts');
      this.cohorts = response.data;
    });
  }

  setCohortHelper(user) {
    console.log('setCohortHelper: finding cohort with _id:', user.cohort._id);
    console.log('in this.cohorts:', this.cohorts);
    var selected = this.$filter('filter')(this.cohorts,
                                          {_id: user.cohort._id}
                                         );
    user.cohort = selected.length ? selected[0] : null;
    console.log('setCohortHelper:', user.cohort);
  }

  setCohort(user, cohort) {
    if (user.cohort) {
      if (this.cohorts.length === 0) {
        this.loadCohorts().then(() => {
          console.log('this.cohorts:', this.cohorts);
          this.setCohortHelper(user);
        });
      }
      else {
        setCohortHelper(user);
      }
    }
  }

  updateRole(user, role) {
    console.log('updateRole:', user, role);
    return this.$http.put('/api/users/' + user._id + '/role', { role: role } );
  }

  updateCohort(user, cohort) {
    console.log('updateCohort:', user, cohort._id);
    return this.$http.put('/api/users/' + user._id + '/cohort',
                          { cohort: cohort._id }
                         )
    .then((response) => {
      console.log('handling response');
      this.setCohortHelper(user);
    });
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('galaxyApp.admin')
  .controller('AdminController', AdminController);

})();
