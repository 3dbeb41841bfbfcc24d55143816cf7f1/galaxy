'use strict';

(function() {

  class InstructorResourcesController {
    constructor(Resource, $uibModal, $log) {
      console.log('InstructorResourcesController is alive!');

      this.Resource = Resource;
      this.$uibModal = $uibModal;
      this.$log = $log;

      // TODO: fetch these from server
      this.tags = ['Lesson', 'Exercise', 'WDI', 'Cheat Sheet', 'HTML', 'JavaScript', 'CSS', 'SASS'];
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
      }

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
        console.log('modalInstance returned newResourceData:', newResourceData);

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
        (new this.Resource(resource)).$delete( () => {
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
  .controller('ModalInstanceCtrl', function($uibModalInstance, resource) {
    this.resource = resource;
    console.log('ModalInstanceCtrl got resource:', this.resource);
    this.ok     = () => { $uibModalInstance.close(this.resource); };
    this.cancel = () => { $uibModalInstance.dismiss('cancel'); };
  });

})();
