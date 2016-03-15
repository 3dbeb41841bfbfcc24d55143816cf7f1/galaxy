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
    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }
}

angular.module('galaxyApp')
  .controller('NavbarController', NavbarController);
