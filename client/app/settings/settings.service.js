'use strict';

(function() {

  class Settings {

    constructor($http) {
      this.$http = $http;
    }

    get() {
      return this.$http.get('/api/settings');
    }
  }

  angular.module('galaxyApp.auth')
  .service('Settings', Settings);

})();
