'use strict';

(function() {

  class AdminController {
    constructor(Auth, $state) {
      console.log('AdminController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
      this.$state = $state;
    }
  }

  angular.module('galaxyApp.admin')
  .component('admin', {
    templateUrl: 'app/admin/admin.html',
    controller: AdminController
  });

})();
