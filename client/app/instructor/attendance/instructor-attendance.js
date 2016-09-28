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
        'dropped',
        'not set'
      ];

      this.load();
      $rootScope.$on('cohortChangeEvent', () => {
        this.load();
      });
      $rootScope.$on('squadChangeEvent', () => {
        this.load();
      });
    }

    getAttendanceCssClass(value) {
      if (value) {
        return value;
      }
      return 'unset';
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

    findStudentIndex(student) {
      this.bigArray.forEach((item, index) => {
        console.log('comparing item %s to student %s', item, student._id);
        if (item._id === student._id) {
          return index;
        }
      });
      return -1;
    }

    findOptionValue(value) {
      return _.find(this.attendanceValues, function(av) { return angular.equals(av, value); });
    }

    showAttendance(dateIndex, studentIndex) {
      let studentValue = this.bigArray[dateIndex] ? this.bigArray[dateIndex][studentIndex] : null;
      let selected = this.findOptionValue(studentValue);
      return selected ? selected : 'Not set';
    }

    onBeforeQuickSet(date, dateIndex, data) {

      // because the server call takes a few seconds, let's go ahead and update the view.
      // this.bigArray[dateIndex].forEach((studentValue) => {
      //   console.log('setting studentValue = %s', data);
      //   studentValue = data;
      // });

      let that = this;
      return this.$http.post('/api/attendances/quickset',
                            { students: _.map(that.students, (student) => { return student._id; }),
                              date: date,
                              value: data
                            })
      .then((response) => {
        console.log('onBeforeQuickSet: response =', response);
      });
    }

    onAfterQuickSet() {
      console.log('onAfterQuickSet');
      this.load();
    }

    onBeforeSaveAttendance(date, student, dateIndex, studentIndex, data) {
      return this.$http.put('/api/users/' + student._id + '/attendance',
                            { attendance: { date: date, value: data } }
                           )
      .then((response) => {
        console.log('onBeforeSaveAttendance: response =', response);
      });
    }
  }

  angular.module('galaxyApp')
  .component('instructorAttendance', {
    templateUrl: 'app/instructor/attendance/instructor-attendance.html',
    controller: InstructorAttendanceController
  });

})();
