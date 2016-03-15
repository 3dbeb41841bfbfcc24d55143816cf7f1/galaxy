'use strict';

(function() {

  class InstructorAttendanceController {
    constructor(Auth) {
      console.log('InstructorAttendanceController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp')
  .component('instructorAttendance', {
    templateUrl: 'app/instructor/attendance/instructor-attendance.html',
    controller: InstructorAttendanceController
  });

})();
