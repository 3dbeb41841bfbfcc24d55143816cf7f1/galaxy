'use strict';

(function() {

  function compareDates(date1, date2) {
    if (date1.getFullYear() != date2.getFullYear()) return false;
    if (date1.getMonth()    != date2.getMonth())    return false;
    if (date1.getDate()     != date2.getDate())     return false;
    return true;
  }

  /**
   * Generate 60 days of dates starting with startDate
   * but not including Saturdays and Sundays.
  **/
  function makeDates(startDate) {
    let days = [];
    const NUM_DATES = 60;
    for (let d=0, cnt=0; cnt<NUM_DATES; d++) {
      let day = new Date(startDate);
      day.setDate(startDate.getDate() + d);
      let dayOfWeek = day.getDay();
      // skip Saturdays and Sundays
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      cnt = cnt + 1;
      days.push(new Date(day));
    }
    return days;
  }

  class InstructorAttendanceController {
    constructor(Auth, $filter, $http) {
      console.log('InstructorAttendanceController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
      this.$filter = $filter;
      this.$http = $http;

      this.dates = makeDates(new Date(2016, 2, 21));

/*
      this.students = [];
      const NUM_STUDENTS = 24;
      for (var i = 1; i <= NUM_STUDENTS; i++) {
        this.students.push({
          _id: i,
          name: 'student' + i,
          attendance: [
            { date: new Date(2016, 2, 21), value: 'present'   },
            { date: new Date(2016, 2, 22), value: 'late'      },
            { date: new Date(2016, 2, 23), value: 'excused'   },
            { date: new Date(2016, 2, 24), value: 'unexcused' },
            { date: new Date(2016, 2, 25), value: undefined   }
          ],
          attendanceValue: 'late'
        });
      }
*/

      this.attendanceValues = [
        'present',
        'late',
        'excused',
        'unexcused',
      ];

      this.users = $http.get('/api/users', { params: {role: 'student'} })
      .then((response) => {
        this.students = response.data;
        console.log('this.students:', this.students);
        // bigArray is a 2-D array of dates and student attendance objects
        // I had to build this bigArray to make angular xeditable controls work
        // within nested ng-repeats.
        this.bigArray = [];
        this.dates.forEach((date) => {
          let innerArray = [];
          this.students.forEach((student) => {
            let studentValue = this.findStudentValue(student, date);
            let sv = studentValue ? studentValue.value : undefined;
            innerArray.push(this.findOptionValue(sv));
          });
          this.bigArray.push(innerArray);
        });
      });
    }

    findStudentValue(student, date) {
      return _.find(student.attendance, function(a) { return angular.equals(new Date(a.date), date); });
    }

    findOptionValue(value) {
      return _.find(this.attendanceValues, function(av) { return angular.equals(av, value); });
    }

    showAttendance(index1, index2) {
      let studentValue = this.bigArray[index1][index2];
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

    onAfterSaveAttendance(date, student, index1, index2, data) {
      console.log('onAfterSaveAttendance:', this.bigArray[index1][index2]);
    }
  }

  angular.module('galaxyApp')
  .component('instructorAttendance', {
    templateUrl: 'app/instructor/attendance/instructor-attendance.html',
    controller: InstructorAttendanceController
  });

})();
