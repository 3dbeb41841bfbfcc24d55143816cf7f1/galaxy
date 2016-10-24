'use strict';

(function() {

  class InstructorResourcesController {
    constructor(Resource, Tag, $uibModal, $log, $filter, $scope) {
      $log.info('InstructorResourcesController is alive!');

      this.Resource = Resource;
      this.Tag = Tag;
      this.$uibModal = $uibModal;
      this.$log = $log;
      this.$filter = $filter;

      this.selectionMode = 'union';
      this.resourceTextFilter = '';

      $scope.$watch( () => this.selectionMode,
                     () => this.filterResources()
                   );

      $scope.$watch( () => this.resourceTextFilter,
                     () => this.filterResources()
                   );

      // TODO: handle newly created resources
      this.loadResources();
    }

    resetFiltering() {
      this.resourceTextFilter = '';
      this.selectionMode = 'union';
      this.Tag.allTags.forEach( tag => tag.mode = 'neutral' );
    }

    getTags() {
      return this.selectionMode === 'union' ?
             this.Tag.allTags :
             this.Tag.allTags.filter( tag => tag.mode !== 'neutral' || this.countTagInFilteredResults(tag) > 0);
    }

    loadResources() {
      console.time('loading Resources');
      this.resources = this.Resource.query( (resources) => {
        console.timeEnd('loading Resources');
        console.time('adding tags');
        resources.forEach( resource => this.Tag.addTags(resource.tags) );
        console.timeEnd('adding tags');
        this.pageSize = 10;
        this.currentPage = 1;
        this.beginIndex = 0;
        this.filterResources();
      });
    }

    toggleTag(tag) {
      switch(tag.mode) {
        case 'neutral':  tag.mode = 'include'; break;
        case 'include':  tag.mode = 'exclude'; break;
        case 'exclude':  tag.mode = 'neutral'; break;
        default:         tag.mode = 'neutral'; break;
      }
      this.filterResources();
    }

    getClassForTag(tag) {
      switch (tag.mode) {
        case 'include': return 'btn-success'; break;
        case 'neutral': return 'btn-primary'; break;
        case 'exclude': return 'btn-danger'; break;
        default:        return 'btn-info';
      }
    }

    filterResources() {
      console.time('filtering resources');
      this.filteredResources = this.$filter('tagfilter')(this.resources,
                                                         this.Tag.allTags,
                                                         this.selectionMode);
      if (this.resourceTextFilter) {
        this.filteredResources = this.$filter('filter')(this.filteredResources,
                                                        this.resourceTextFilter,
                                                        false // comparator
                                                      /* , anyPropertyKey */ )
      }
      this.updatePage();
      console.timeEnd('filtering resources');
    }

    updatePage() {
      this.paginatedFilteredResources = this.$filter('limitTo')(this.filteredResources,
                                                                this.pageSize,
                                                                this.getBeginIndex());
    }

    getBeginIndex() {
      return this.filteredResources.length === 0 ? -1 : (this.currentPage-1) * this.pageSize;
    }

    getEndIndex() {
      return Math.min(this.filteredResources.length, this.currentPage * this.pageSize) - 1;
    }

    countTagInFilteredResults(tag) {
      return this.filteredResources.reduce( (acc, r) => acc + (this.Tag.contains(r.tags, tag) ? 1 : 0), 0);
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
