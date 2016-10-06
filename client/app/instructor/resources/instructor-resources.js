'use strict';

(function() {

  class InstructorResourcesController {
    constructor(Resource, Tag, $uibModal, $log) {
      $log.info('InstructorResourcesController is alive!');

      this.Resource = Resource;
      this.Tag = Tag;
      this.$uibModal = $uibModal;
      this.$log = $log;

      this.selectionMode = 'any';

      // TODO: handle newly created cohorts
      this.resources = this.Resource.query();
    }

    toggleTag(tag) {
      switch(tag.mode) {
        case 'neutral':  tag.mode = 'include'; break;
        case 'include':  tag.mode = 'exclude'; break;
        case 'exclude':  tag.mode = 'neutral'; break;
        default:          tag.mode = 'neutral'; break;
      }
    }

    addResource() {
      let resource = {
        title: '',
        info: '',
        url: '',
        tags: []
      };

      let modalInstance = this.$uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'app/instructor/resources/new-resource.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        resolve: {
          resource: () => {
            return resource;
          }
        }
      });

      modalInstance.result.then( (newResourceData) => {
        // extract the tag strings from the tag objects
        newResourceData.tags = newResourceData.tags.map( t => t.name );
        // save it via a POST
        let newResource = new this.Resource(newResourceData);
        newResource.$save( (savedResource) => {
          this.$log.info('savedResource', savedResource);
          this.resources = this.Resource.query();
        });
      }, () => {
        this.$log.info('Modal dismissed at: ' + new Date());
      });
    }

    deleteResource(index, resource) {
      if (confirm('Are you sure?')) {
        new this.Resource(resource).$delete( () => {
          this.$log.info('resource has been deleted');
          this.resources = this.Resource.query();
        });
      }
    }
  }

  angular.module('galaxyApp')
  .component('instructorResources', {
    templateUrl: 'app/instructor/resources/instructor-resources.html',
    controller: InstructorResourcesController
  })
  .filter('tagfilter', ($log) => {

    function contains(tags, tagToMatch) {
      let nameToMatch = tagToMatch.name || tagToMatch;

      let result = tags.reduce( (acc, tag) => {
        let tagName = tag.name || tag;
        console.log(`comparing '${tagName}' to '${nameToMatch}'`);
        return acc || tagName === nameToMatch;
      }, false);

      console.log('contains:', tags, tagToMatch, result);
      return result;
    }

    return function(resources, allTags, mode) {
      $log.info('allTags:', allTags);
      $log.info('mode:', mode);
      let includedTags = allTags.filter( tag => tag.mode === 'include' );
      let excludedTags = allTags.filter( tag => tag.mode === 'exclude' );

      $log.info('includedTags:', includedTags);
      $log.info('excludedTags:', excludedTags);

      // if no filtering, return all of the resources
      if (includedTags.length === 0 && excludedTags.length === 0) {
        return resources;
      }

      // apply the included tags filtering using either "any" or "all" filtering.
      let any = resource => resource.tags.reduce((acc, tag) => acc || contains(includedTags , tag), false);
      let all = resource => includedTags. reduce((acc, tag) => acc && contains(resource.tags, tag), true );
      let f = mode === 'any' ? any : all;
      let result = includedTags.length === 0 ? resources : resources.filter(f);

      console.log('result from step 1:', result);

      // filter out the resources that contain an excluded tag
      let exclude = resource => excludedTags.reduce((acc, tag) => acc && !contains(resource.tags, tag), true );
      return result.filter(exclude);
    };
  })
  .controller('ModalInstanceCtrl', function($uibModalInstance, resource, Tag, $log) {
    this.resource = resource;
    this.Tag = Tag;
    this.$log = $log;
    this.$log.info('ModalInstanceCtrl got resource:', this.resource);

    // $query is the input text that we want to filter against
    this.getMatchingTags = ($query) => {
      return this.Tag.allTags.filter(function(tag) {
        return tag.name.toLowerCase().indexOf($query.toLowerCase()) !== -1;
      });
    };

    this.ok     = () => { $uibModalInstance.close(this.resource); };
    this.cancel = () => { $uibModalInstance.dismiss('cancel'); };
  });

})();
