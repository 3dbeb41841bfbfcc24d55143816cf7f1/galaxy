'use strict';

(function() {
  /**
   * Generate 60 days of dates starting with startDate
   * but not including Saturdays and Sundays.
  **/
  function makeWeeks(startDate) {
    let weeks = [];
    let currentWeek = {
      num: 1,
      days: []
    };
    const NUM_DATES = 60;
    for (let d=0, cnt=0; cnt<NUM_DATES; d++) {
      let day = new Date(startDate);
      day.setDate(startDate.getDate() + d);
      let dayOfWeek = day.getDay();
      // skip Saturdays and Sundays
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      if (cnt % 5 === 0) {
        currentWeek = {
          num: (cnt / 5) + 1,
          days: []
        };
        weeks.push(currentWeek);
      }
      currentWeek.days.push(new Date(day));
      ++cnt;
    }
    return weeks;
  }

  class InstructorAttendanceController {
    constructor(Auth, Cohort, Squad, $filter, $http, $rootScope) {
      console.log('InstructorAttendanceController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
      this.Cohort = Cohort;
      this.Squad  = Squad;
      this.$filter = $filter;
      this.$http = $http;

      this.attendanceValues = [
        'present',
        'late',
        'excused',
        'unexcused',
      ];

      this.load();
      $rootScope.$on('cohortChangeEvent', () => {
        this.load();
      });
      $rootScope.$on('squadChangeEvent', () => {
        this.load();
      });
    }

    load() {
      // TODO: DRY this up
      let theCohort = this.Cohort.getCurrentCohort();
      let cohortId = theCohort ? theCohort._id : undefined;

      let theSquad  = this.Squad.getCurrentSquad();
      let squadId = theSquad ? theSquad._id : undefined;

      this.weeks = theCohort ? makeWeeks(this.Cohort.getCurrentCohort().startDate)
                             : [];

      // this.Cohort.getUsers('student')
      this.$http.get('/api/users',
                     { params: {
                                 role: 'student',
                                 cohort: cohortId,
                                 squad: squadId }
      })
      .then((response) => {
        this.students = response.data;

        // bigArray is a 2-D array of dates and student attendance objects
        // I had to build this bigArray to make angular xeditable controls work
        // within nested ng-repeats.
        this.bigArray = [];
        this.weeks.forEach(week => {
          week.days.forEach(day => {
            let innerArray = [];
            this.students.forEach((student) => {
              let studentValue = this.findStudentValue(student, day);
              let sv = studentValue ? studentValue.value : undefined;
              innerArray.push(this.findOptionValue(sv));
            });
            this.bigArray.push(innerArray);
          });
        });
      });
    }

    findStudentValue(student, date) {
      return _.find(student.attendance, function(a) { return angular.equals(new Date(a.date), date); });
    }

    findOptionValue(value) {
      return _.find(this.attendanceValues, function(av) { return angular.equals(av, value); });
    }

    getStudentNameAndLogin(student) {
      let result = student.name ? student.name : '???';
      if (student.github) {
        result += ' (' + student.github.login + ')';
      }
      return result;
    }

    showAttendance(index1, index2) {
      let studentValue = this.bigArray[index1] ? this.bigArray[index1][index2] : null;
      let selected = this.findOptionValue(studentValue);
      return selected ? selected : 'Not set';
    }

    onBeforeSaveAttendance(date, student, index1, index2, data) {
      return this.$http.put('/api/users/' + student._id + '/attendance',
                            { attendance: { date: date, value: data } }
                           )
      .then((response) => {
        console.log('onBeforeSaveAttendance: response =', response);
        // this.bigArray[index1][index2] = data;
      });
    }

    onAfterSaveAttendance(date, student, index1, index2 /*, data */) {
      console.log('onAfterSaveAttendance:', this.bigArray[index1][index2]);
    }
  }

  angular.module('galaxyApp')
  .component('instructorAttendance', {
    templateUrl: 'app/instructor/attendance/instructor-attendance.html',
    controller: InstructorAttendanceController
  });

})();
