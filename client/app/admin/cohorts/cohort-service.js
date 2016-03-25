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
      promise.then(response => {
        this.cohorts = response.data;
        // convert string dates to Date objects.
        this.cohorts.forEach(cohort => {
          cohort.startDate = new Date(cohort.startDate);
        });
        // if (!this.currentCohort) {
        //   this.currentCohort = this.cohorts[0] || null;
        // }
      });
      return promise;
    }

    getCurrentCohort() {
      let currentUser = this.Auth.getCurrentUser();
      if (this.currentCohort === null) {
        return null;
      }
      else if (this.currentCohort) {
        return this.currentCohort;
      }
      else if (currentUser.cohort) {
        let result = _.find(this.cohorts, (cohort) => { return cohort._id === currentUser.cohort._id; });
        return result;
      }
      else {
        // return this.cohorts[0] || null;
        return null;
      }
    }

    setCurrentCohort(cohort) {
      console.log('setCurrentCohort:', cohort ? cohort.name : null);
      this.currentCohort = cohort;
      this.$rootScope.$emit('cohortChangeEvent', this.currentCohort);
    }

    getUsers(role, cohort) {
      let theCohort = cohort || this.getCurrentCohort();
      console.log('getting users for cohort:', theCohort ? theCohort.name : null);
      let cohortId = theCohort ? theCohort._id : undefined;
      return this.$http.get('/api/users', { params: {role: role, cohort: cohortId } });
    }
  }

  angular.module('galaxyApp.admin')
  .service('Cohort', Cohort);

})();
