'use strict';

(function() {

  class Squad {

    constructor(Auth, $http, $rootScope) {
      console.log('Squad is alive!');
      this.Auth = Auth;
      this.$http = $http;
      this.$rootScope = $rootScope;
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

    getCurrentSquad() {
      return this.currentSquad;
    }

    setCurrentSquad(squad) {
      console.log('setCurrentSquad:', squad ? squad.name : null);
      this.currentSquad = squad;
      this.$rootScope.$emit('squadChangeEvent', this.currentSquad);
    }

    getUsers(squad) {
      let squadId = squad ? squad._id : undefined;
      return this.$http.get('/api/users', { params: {squad: squadId } });
    }
  }

  angular.module('galaxyApp.admin')
  .service('Squad', Squad);

})();
