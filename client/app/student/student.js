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
    })
    .state({
      name: 'student.profiles',
      url: '/student-profiles',
      template: '<student-profiles></student-profiles>',
    })
    .state({
      name: 'student.mysquad',
      url: '/mysquad',
      template: '<student-my-squad></student-my-squad>',
    })
    .state({
      name: 'student.attendance',
      url: '/attendance',
      template: '<student-attendance></student-attendance>',
    })
    .state({
      name: 'student.homework',
      url: '/homework',
      template: '<student-homework></student-homework>',
    })
    .state({
      name: 'student.projects',
      url: '/projects',
      template: '<student-projects></student-projects>',
    });
  });
