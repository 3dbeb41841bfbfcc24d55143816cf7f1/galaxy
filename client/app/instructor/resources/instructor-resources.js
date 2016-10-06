'use strict';

(function() {

  class InstructorResourcesController {
    constructor(Resource, Tag, $uibModal, $log) {
      $log.info('InstructorResourcesController is alive!');

      this.Resource = Resource;
      this.Tag = Tag;
      this.$uibModal = $uibModal;
      this.$log = $log;

      this.selectedTags = [];
      this.selectionMode = 'any';

      // TODO: handle newly created cohorts
      this.resources = this.Resource.query();
    }

    isSelected(tag) {
      return this.selectedTags.indexOf(tag) !== -1;
    }

    toggleSelected(tag) {
      let index = this.selectedTags.indexOf(tag);
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      }
      else {
        this.selectedTags.push(tag);
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
        newResourceData.tags = newResourceData.tags.map( t => t.text );
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
  .filter('tagfilter', () => {
    return function(resources, selectedTags, mode) {
      let any = resource => resource.tags.reduce((acc, tag) => acc || selectedTags. indexOf(tag) !== -1, false);
      let all = resource => selectedTags. reduce((acc, tag) => acc && resource.tags.indexOf(tag) !== -1, true);
      let f = mode === 'any' ? any : all;
      return selectedTags.length === 0 ? resources : resources.filter(f);
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
        // return tag.name.toLowerCase().indexOf($query.toLowerCase()) !== -1;
        return tag.toLowerCase().indexOf($query.toLowerCase()) !== -1;
      });
    };

    this.ok     = () => { $uibModalInstance.close(this.resource); };
    this.cancel = () => { $uibModalInstance.dismiss('cancel'); };
  });

})();
