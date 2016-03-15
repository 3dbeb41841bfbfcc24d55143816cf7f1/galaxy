'use strict';

angular.module('galaxyApp')
.config(function($stateProvider) {
  $stateProvider
    .state({
      name: 'student',
      url: '/student',
      template: '<student></student>'
    })
    .state({
      name: 'student.dashboard',
      url: '/dashboard',
      template: '<student-dashboard></student-dashboard>',
      onEnter: () => {
        console.log('onEnter: student.dashboard');
      }
    })
    .state({
      name: 'student.attendance',
      url: '/attendance',
      template: '<student-attendance></student-attendance>',
      onEnter: () => {
        console.log('onEnter: student.attendance');
      }
    })
    .state({
      name: 'student.homework',
      url: '/homework',
      template: '<student-homework></student-homework>',
      onEnter: () => {
        console.log('onEnter: student.homework');
      }
    });
  });
