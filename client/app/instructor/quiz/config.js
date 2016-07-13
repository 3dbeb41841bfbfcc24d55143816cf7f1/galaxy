'use strict';

(function() {
  angular.module('galaxyApp')
  .config(function (hljsServiceProvider) {
    console.log('hljsServiceProvider config');
    hljsServiceProvider.setOptions({
      tabReplace: '    '  // replace tab with 4 spaces
    });
  });
})();
