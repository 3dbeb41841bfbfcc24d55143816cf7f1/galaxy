'use strict';

(function() {

  class Squad {

    constructor(Auth, $http) {
      console.log('Squad is alive!');
      this.Auth = Auth;
      this.$http = $http;
      this.getSquads();
    }

    // TODO: handle newly created squads
    getSquads() {
      let promise = this.$http.get('/api/squads');
      promise.then((response) => {
        this.squads = response.data;
      });
      return promise;
    }

    getUsers(squad) {
      let squadId = squad ? squad._id : undefined;
      return this.$http.get('/api/users', { params: {squad: squadId } });
    }
  }

  angular.module('galaxyApp.admin')
  .service('Squad', Squad);

})();
