'use strict';

(function() {

  class InstructorResourcesController {
    constructor(Resource, Tag, $uibModal, $log, $sce) {
      $log.info('InstructorResourcesController is alive!');

      this.Resource = Resource;
      this.Tag = Tag;
      this.$uibModal = $uibModal;
      this.$log = $log;

      this.selectionMode = 'any';

      // TODO: handle newly created cohorts
      this.loadResources();
    }

    loadResources() {
      this.resources = this.Resource.query( (resources) => {
        resources.forEach( resource => this.Tag.addTags(resource.tags) );
      });
    }

    toggleTag(tag) {
      switch(tag.mode) {
        case 'neutral':  tag.mode = 'include'; break;
        case 'include':  tag.mode = 'exclude'; break;
        case 'exclude':  tag.mode = 'neutral'; break;
        default:         tag.mode = 'neutral'; break;
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
          this.loadResources();
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
