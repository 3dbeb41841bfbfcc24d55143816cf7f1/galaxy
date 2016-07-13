'use strict';

(function() {
  angular.module('galaxyApp')
  .filter('html', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  });
})();
