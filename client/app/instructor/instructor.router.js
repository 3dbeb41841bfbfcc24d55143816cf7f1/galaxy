'use strict';

angular.module('galaxyApp')
.config(function($stateProvider) {
  $stateProvider
  .state({
    name: 'instructor',
    url: '/instructor',
    abstract: '.student-profiles',
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
  })
  .state({
    name: 'instructor.projects',
    url: '/projects',
    template: '<instructor-projects></instructor-projects>',
    onEnter: () => {
      console.log('onEnter: instructor.projects');
    }
  })
  .state({
    name: 'instructor.quizzes',
    url: '/quizzes',
    template: '<instructor-quizzes></instructor-quizzes>',
    onEnter: () => {
      console.log('onEnter: instructor.quizzes');
    }
  })
  .state({
    name: 'instructor.quiz',
    url: '/quiz',
    template: '<quiz></quiz>',
    onEnter: () => {
      console.log('onEnter: instructor.quiz');
    }
  })
  .state({
    name: 'instructor.resources',
    url: '/resources',
    template: '<instructor-resources></instructor-resources>',
    onEnter: () => {
      console.log('onEnter: instructor-resources');
    }
  });
});
