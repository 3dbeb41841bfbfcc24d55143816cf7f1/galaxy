'use strict';

angular.module('galaxyApp.auth', [
  'galaxyApp.constants',
  'galaxyApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
