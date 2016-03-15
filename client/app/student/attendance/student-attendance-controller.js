'use strict';

(function() {

  class StudentAttendanceController {
    constructor(Auth) {
      console.log('StudentAttendanceController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('studentAttendance', {
    templateUrl: 'app/student/attendance/student-attendance.html',
    controller: StudentAttendanceController
  });

})();
