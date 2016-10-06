'use strict';

(function() {

  function Resource($resource) {
    return $resource('/api/resources/:id', { id: '@_id' });
  }

  angular.module('galaxyApp')
  .factory('Resource', Resource);

})();

/* $resource adds the following methods:
get'      method:'GET'},
$save'    method:'POST'},
query'    method:'GET', isArray:true},
$remove'  method:'DELETE'},
$delete'  method:'DELETE'} }
*/
