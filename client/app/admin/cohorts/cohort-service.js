'use strict';

(function() {

  class Cohort {

    constructor($http) {
      this.$http = $http;
      this.get();
    }

    // TODO: handle newly created cohorts
    get() {
      return this.$http.get('/api/cohorts')
      .then((response) => {
        this.cohorts = response.data;
        // convert string dates to Date objects.
        this.cohorts.forEach((cohort) => {
          cohort.startDate = new Date(cohort.startDate);
        });
      });
    }
  }

  angular.module('galaxyApp.admin')
  .service('Cohort', Cohort);

})();
