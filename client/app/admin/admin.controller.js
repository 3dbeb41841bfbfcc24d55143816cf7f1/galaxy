'use strict';

(function() {

class AdminController {
  constructor(User, appConfig, $http) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.roles = appConfig.userRoles;
    this.$http = $http;
  }

  updateRole(user, role) {
    console.log('updateRole:', user, role);
    return this.$http.put('/api/users/' + user._id + '/role', { role: role } );
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('galaxyApp.admin')
  .controller('AdminController', AdminController);

})();
