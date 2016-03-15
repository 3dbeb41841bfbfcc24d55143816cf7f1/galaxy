'use strict';

(function() {

  class StudentDashboardController {
    constructor(Auth) {
      console.log('StudentDashboardController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('studentDashboard', {
    templateUrl: 'app/student/dashboard/student-dashboard.html',
    controller: StudentDashboardController
  });

})();
