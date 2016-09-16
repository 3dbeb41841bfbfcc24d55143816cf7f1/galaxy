'use strict';

(function() {

  class InstructorDashboardController {
    constructor($http, socket, Auth) {
      console.log('InstructorDashboardController is alive!');

      this.$http = $http;
      this.socket = socket;

      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('instructorDashboard', {
    templateUrl: 'app/instructor/dashboard/instructor-dashboard.html',
    controller: InstructorDashboardController
  });

})();
