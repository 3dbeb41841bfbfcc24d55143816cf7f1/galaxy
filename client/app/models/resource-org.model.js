'use strict';

(function() {

  function ResourceOrg($resource) {
    return $resource('/api/resource-orgs/:id', { id: '@_id' });
  }

  angular.module('galaxyApp')
  .factory('ResourceOrg', ResourceOrg);

})();

/* $resource adds the following methods:
get'      method:'GET'},
$save'    method:'POST'},
query'    method:'GET', isArray:true},
$remove'  method:'DELETE'},
$delete'  method:'DELETE'} }
*/
