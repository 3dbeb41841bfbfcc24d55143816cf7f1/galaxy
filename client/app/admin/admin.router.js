'use strict';

angular.module('galaxyApp.admin')
.config(function($stateProvider) {
  $stateProvider
  .state({
    name: 'admin',
    url: '/admin',
    template: '<admin></admin>'
  })
  .state({
    name: 'admin.dashboard',
    url: '/dashboard',
    template: '<admin-dashboard></admin-dashboard>'
  })
  .state({
    name: 'admin.users',
    url: '/users',
    template: '<admin-users></admin-users>'
  })
  .state({
    name: 'admin.cohorts',
    url: '/cohorts',
    template: '<admin-cohorts></admin-cohorts>'
  })
  .state({
    name: 'admin.squads',
    url: '/squads',
    template: '<admin-squads></admin-squads>'
  })
  .state({
    name: 'admin.homework',
    url: '/homework',
    template: '<admin-homework></admin-homework>'
  });
});
