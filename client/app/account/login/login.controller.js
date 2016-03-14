'use strict';

class LoginController {
  constructor(Auth, Settings, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.Settings = Settings;
    this.$state = $state;

    this.Settings = Settings;

    Settings.get()
    .then(response => {
      console.log('response:', response);
      this.settings = response.data;
      console.log('settings:', this.settings);
    });
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('galaxyApp')
  .controller('LoginController', LoginController);
