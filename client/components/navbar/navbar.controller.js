'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, Settings, Cohort, Squad) {
    console.log('navbar ctor');
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.Settings = Settings;
    this.Cohort = Cohort;
    this.Squad = Squad;

    this.cohorts = [];
    Cohort.getCohorts().then(response => {
      this.cohorts = response.data;
    });

    this.squads = [];
    Squad.getSquads().then(response => {
      this.squads = response.data;
    });

    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }

  getCurrentCohort() {
    return this.Cohort.getCurrentCohort();
  }
  setCurrentCohort(cohort) {
    this.Cohort.setCurrentCohort(cohort);
  }

  getCurrentSquad() {
    return this.Squad.getCurrentSquad();
  }
  setCurrentSquad(squad) {
    this.Squad.setCurrentSquad(squad);
  }
}

angular.module('galaxyApp')
  .controller('NavbarController', NavbarController);
