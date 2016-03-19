'use strict';

(function() {

  class SquadAdminController {
    constructor($http) {
      this.squads = [];
    }

    // TODO: handle newly created squads
    loadSquads(user) {
      return this.$http.get('/api/squads')
      .then((response) => {
        this.squads = response.data;
      });
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminSquads', {
    templateUrl: 'app/admin/squads/squad-admin.html',
    controller: SquadAdminController
  });

})();
