'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, Settings, $state, appConfig) {
    this.Auth = Auth;
    this.$state = $state;
    this.user.role = 'student';
    this.userRoles = appConfig.userRoles;

    this.Settings = Settings;
    Settings.get()
    .then(response => {
      this.settings = response.data;
    });
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
        role: this.user.role,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });
      });
    }
  }
}

angular.module('galaxyApp')
  .controller('SignupController', SignupController);
