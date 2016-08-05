'use strict';

(function() {

  class StudentDashboardController {
    constructor(Auth) {
      console.log('StudentDashboardController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
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
  }

  angular.module('galaxyApp')
  .component('studentDashboard', {
    templateUrl: 'app/student/dashboard/student-dashboard.html',
    controller: StudentDashboardController
  });

})();
