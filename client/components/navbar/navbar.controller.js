'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Settings) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.Settings = Settings;

    // TODO:
    this.cohorts = [
      { name: 'red' },
      { name: 'green' },
      { name: 'blue' }
    ];
    this.currentCohort = this.cohorts[0];

    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }

  setCurrentCohort(cohort) {
    this.currentCohort = cohort;
  }
}

angular.module('galaxyApp')
  .controller('NavbarController', NavbarController);
