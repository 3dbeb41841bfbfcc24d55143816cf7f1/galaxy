'use strict';

angular.module('galaxyApp')
.config(function($stateProvider) {
  $stateProvider
    .state({
      name: 'instructor',
      url: '/instructor',
      template: '<instructor></instructor>'
    })
    .state({
      name: 'instructor.dashboard',
      url: '/dashboard',
      template: '<instructor-dashboard></instructor-dashboard>',
      onEnter: () => {
        console.log('onEnter: instructor.dashboard');
      }
    })
    .state({
      name: 'instructor.student-profiles',
      url: '/student-profiles',
      template: '<student-profiles></student-profiles>',
      onEnter: () => {
        console.log('onEnter: instructor.student-profiles');
      }
    })
    .state({
      name: 'instructor.attendance',
      url: '/attendance',
      template: '<instructor-attendance></instructor-attendance>',
      onEnter: () => {
        console.log('onEnter: instructor.attendance');
      }
    })
    .state({
      name: 'instructor.homework',
      url: '/homework',
      template: '<instructor-homework></instructor-homework>',
      onEnter: () => {
        console.log('onEnter: instructor.homework');
      }
    });
  });
