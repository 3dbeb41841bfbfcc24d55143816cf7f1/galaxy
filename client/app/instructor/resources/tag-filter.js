'use strict';

(function() {

  angular.module('galaxyApp')
  .filter('tagfilter', (Tag) => {
    return function(resources, orgs, tags, mode) {
      console.log('tagFilter started:', new Date());

      let filteredResources = resources;

      // apply the org filtering
      let includedOrgs = orgs.filter( org => org.mode === 'include' );
      let excludedOrgs = orgs.filter( org => org.mode === 'exclude' );

      if (includedOrgs.length !== 0) {
        // apply the included orgs filtering using either "union" or "intersecton" filtering.
        let union       = resource => includedOrgs.reduce((acc, org) => acc || (resource.org === org.name), false );
        let intersecton = resource => includedOrgs.reduce((acc, org) => acc && (resource.org === org.name), true  );
        let f = mode === 'union' ? union : intersecton;
        filteredResources = filteredResources.filter(f);
      }
      if (excludedOrgs.length !== 0) {
        let exclude = resource => excludedOrgs.reduce((acc, org) => acc && (resource.org !== org.name), true );
        filteredResources = filteredResources.filter(exclude);
      }

      // apply the tag filtering
      let includedTags = tags.filter( tag => tag.mode === 'include' );
      let excludedTags = tags.filter( tag => tag.mode === 'exclude' );

      if (includedTags.length !== 0) {
        // apply the included tags filtering using either "union" or "intersecton" filtering.
        let union       = resource => resource.tags.reduce((acc, tag) => acc || Tag.contains(includedTags , tag), false);
        let intersecton = resource => includedTags. reduce((acc, tag) => acc && Tag.contains(resource.tags, tag), true );
        let f = mode === 'union' ? union : intersecton;
        filteredResources = filteredResources.filter(f);
      }
      if (excludedTags.length !== 0) {
        let exclude = resource => excludedTags.reduce((acc, tag) => acc && !Tag.contains(resource.tags, tag), true );
        filteredResources = filteredResources.filter(exclude);
      }

      console.log(`tagFilter returning: ${filteredResources.length} resources at ${new Date()}`);
      return filteredResources;
    };
  });

})();
