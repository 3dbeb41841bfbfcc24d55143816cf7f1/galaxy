'use strict';

(function() {

  class CohortAdminController {
    constructor($http, Cohort) {
      this.$http = $http;
      this.Cohort = Cohort;
      this.cohorts = [];
      this.loadCohorts();
    }

    // TODO: handle newly created cohorts
    loadCohorts() {
      this.Cohort.getCohorts()
      .then(() => {
        this.cohorts = this.Cohort.cohorts;
        console.log('this.cohorts:', this.cohorts);
      });
    }

    addCohort() {
      console.log('addCohort:');

      this.inserted = {
        name: '',
        info: null,
        startDate: null,
        active: true
      };
      this.cohorts.push(this.inserted);
    }

    saveCohort(index, data, id) {
      console.log('saveCohort: index=%s, data=%s, id=%s', index, JSON.stringify(data), id);
      if (id) {
        data._id = id;
        this.$http.put('/api/cohorts/' + data._id, data)
        .then((response) => {
          console.log('cohort saved');
        });
      }
      else {
        this.$http.post('/api/cohorts', data)
        .then((response) => {
          console.log('new cohort:', response.data);
          this.cohorts[index] = response.data;
        });
      }
    }

    removeCohort(index, cohort) {
      console.log('removeCohort: index=%s, cohort=%s', index, JSON.stringify(cohort));
      if (confirm('Are you sure?')) {
        this.$http.delete('/api/cohorts/' + cohort._id)
        .then((response) => {
          this.cohorts.splice(this.cohorts.indexOf(cohort), 1);
        });
      }
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminCohorts', {
    templateUrl: 'app/admin/cohorts/cohort-admin.html',
    controller: CohortAdminController
  });

})();
