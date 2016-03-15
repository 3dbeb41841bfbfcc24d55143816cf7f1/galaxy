'use strict';

(function() {

  class MainController {
    constructor() {
      console.log('MainController is alive!');
    }
  }

  angular.module('galaxyApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
