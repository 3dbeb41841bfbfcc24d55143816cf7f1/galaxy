'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Settings, Cohort) {
    console.log('navbar ctor');
    this.Auth = Auth;
    this.Settings = Settings;
    this.Cohort = Cohort;

    this.cohorts = [];
    Cohort.getCohorts().then(response => {
      this.cohorts = response.data;
    });

    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }

  isLoggedIn() {
    return this.Auth.isLoggedIn();
  }

  isAdmin() {
    return this.Auth.isAdmin;
  }

  getCurrentUser(){
    return this.Auth.getCurrentUser();
  }

  getCurrentCohort() {
    return this.Cohort.getCurrentCohort();
  }

  setCurrentCohort(cohort) {
    this.Cohort.setCurrentCohort(cohort);
  }
}

angular.module('galaxyApp')
  .controller('NavbarController', NavbarController);
