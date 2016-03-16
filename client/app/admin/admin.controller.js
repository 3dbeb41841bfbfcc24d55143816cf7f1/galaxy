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

  setCohortInVM(user, cohort) {
    var selected = this.$filter('filter')(this.cohorts,
                                          {_id: cohort._id}
                                         );
    user.cohort = selected.length ? selected[0] : null;
  }

  updateRole(user, role) {
    return this.$http.put('/api/users/' + user._id + '/role', { role: role } );
  }

  updateCohort(user, cohort) {
    return this.$http.put('/api/users/' + user._id + '/cohort',
                          { cohort: cohort._id }
                         )
    .then((response) => {
      this.setCohortInVM(user, cohort);
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
