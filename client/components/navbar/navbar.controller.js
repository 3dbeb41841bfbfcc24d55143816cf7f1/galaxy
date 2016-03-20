'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Settings, Cohort, $timeout) {
    console.log('navbar ctor');
    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.Settings = Settings;
    this.Cohort = Cohort;
    this.$timeout = $timeout;

    this.cohorts = [];
    this.loadCohorts();

    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }

  // TODO: handle newly created cohorts
  loadCohorts() {
    this.Cohort.get()
    .then(() => {
      this.cohorts = this.Cohort.cohorts;
      console.log('this.cohorts:', this.cohorts);
      this.Auth.getCurrentUser(angular.noop)
      .then(user => {
        if (user && user.cohort) {
          this.currentCohort = _.find(this.cohorts, (cohort) => { return cohort._id === user.cohort._id; });
          console.log('currentCohort:', this.currentCohort);
        }
      });
    });
  }

  getCurrentCohort() {
    return this.currentCohort || this.getCurrentUser().cohort || null;
  }

  setCurrentCohort(cohort) {
    this.currentCohort = cohort;
  }
}

angular.module('galaxyApp')
  .controller('NavbarController', NavbarController);
