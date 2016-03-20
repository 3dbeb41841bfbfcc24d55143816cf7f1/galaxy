'use strict';

(function() {

  class Cohort {

    constructor(Auth, $http, $rootScope) {
      console.log('Cohort is alive!');
      this.Auth = Auth;
      this.$http = $http;
      this.$rootScope = $rootScope;
      this.getCohorts();
    }

    // TODO: handle newly created cohorts
    getCohorts() {
      let promise = this.$http.get('/api/cohorts');
      promise.then((response) => {
        this.cohorts = response.data;
        // convert string dates to Date objects.
        this.cohorts.forEach((cohort) => {
          cohort.startDate = new Date(cohort.startDate);
        });
        if (!this.currentCohort) {
          this.currentCohort = this.cohorts[0] || null;
        }
      });
      return promise;
    }

    getCurrentCohort() {
      if (this.currentCohort) {
        return this.currentCohort;
      }
      else if (this.Auth.getCurrentUser().cohort) {
        return _.find(this.cohorts, (cohort) => { return cohort._id === this.Auth.getCurrentUser().cohort._id; });
      }
      else {
        return null;
      }
    }

    setCurrentCohort(cohort) {
      this.currentCohort = cohort;
      this.$rootScope.$emit('cohortChangeEvent', this.currentCohort);
    }
  }

  angular.module('galaxyApp.admin')
  .service('Cohort', Cohort);

})();
