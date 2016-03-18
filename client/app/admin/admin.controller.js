'use strict';

(function() {

  class AdminController {
    constructor(Auth) {
      console.log('AdminController is alive!');
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  angular.module('galaxyApp.admin')
  .component('admin', {
    templateUrl: 'app/admin/admin.html',
    controller: AdminController
  });

})();
