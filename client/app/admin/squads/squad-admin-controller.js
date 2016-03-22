'use strict';

(function() {

  class SquadAdminController {
    constructor($http, Squad) {
      this.$http = $http;
      this.Squad = Squad;
      this.squads = [];
      this.loadSquads();
    }

    // TODO: handle newly created squads
    loadSquads() {
      this.Squad.getSquads()
      .then(() => {
        this.squads = this.Squad.squads;
        console.log('this.squads:', this.squads);
      });
    }

    addSquad() {
      console.log('addSquad:');

      this.inserted = {
        name: '',
        info: null,
        startDate: null,
        active: true
      };
      this.squads.push(this.inserted);
    }

    saveSquad(index, data, id) {
      console.log('saveSquad: index=%s, data=%s, id=%s', index, JSON.stringify(data), id);
      if (id) {
        data._id = id;
        this.$http.put('/api/squads/' + data._id, data)
        .then(() => {
          console.log('squad saved');
        });
      }
      else {
        this.$http.post('/api/squads', data)
        .then((response) => {
          console.log('new squad:', response.data);
          this.squads[index] = response.data;
        });
      }
    }

    removeSquad(index, squad) {
      console.log('removeSquad: index=%s, squad=%s', index, JSON.stringify(squad));
      if (confirm('Are you sure?')) {
        this.$http.delete('/api/squads/' + squad._id)
        .then(() => {
          this.squads.splice(this.squads.indexOf(squad), 1);
        });
      }
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminSquads', {
    templateUrl: 'app/admin/squads/squad-admin.html',
    controller: SquadAdminController
  });

})();
