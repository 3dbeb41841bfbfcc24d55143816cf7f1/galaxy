'use strict';

(function() {

  class InstructorResourcesController {
    constructor(ResourceOrg, Resource, Tag, $uibModal, $log, $filter, $scope) {
      $log.info('InstructorResourcesController is alive!');

      this.ResourceOrg = ResourceOrg;
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
      this.filteredResources = [];
      this.orgs = [];
      this.loadOrgs()
      .then( () => this.loadResources() )
      .then( () => this.filterResources() );
    }

    resetFiltering() {
      this.resourceTextFilter = '';
      this.selectionMode = 'union';
      this.orgs.forEach( org => org.mode = 'neutral' );
      this.Tag.allTags.forEach( tag => tag.mode = 'neutral' );
      this.filterResources();
    }

    getFilteredOrgs() {
      return this.selectionMode === 'union' ?
             this.orgs :
             this.orgs.filter( org => org.mode !== 'neutral' || org.count > 0);
    }

    refreshOrgRepos(org) {
      console.log(org);
      // TODO:
    }

    getTags() {
      return this.selectionMode === 'union' ?
             this.Tag.allTags :
             this.Tag.allTags.filter( tag => tag.mode !== 'neutral' || this.countTagInFilteredResults(tag) > 0);
    }

    lookupOrgById(id) {
      let found = this.orgs.filter( o => o._id === id );
      return found.length > 0 ? found[0] : null;
    }

    updateOrgCounts() {
      this.orgs.forEach( org => { org.count = 0; } );
      this.filteredResources.forEach( resource => {
        let found = this.lookupOrgById(resource.org);
        if (found) {
          found.count += 1;
        }
        else {
          console.error(`Could not find org for resource: ${resource.title} with org ${resource.org}`);
        }
      });
    }

    loadOrgs() {
      console.time('loading ResourceOrgs');
      this.orgs = this.ResourceOrg.query( (orgs) => {
        console.log(`loaded ${orgs.length} resource orgs.`);
        orgs.forEach( org => {
          org.mode = 'neutral';
          org.count = 0;
        });
      });
      return this.orgs.$promise;
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
      });
      return this.resources.$promise;
    }

    toggleMode(obj) {
      switch(obj.mode) {
        case 'neutral':  obj.mode = 'include'; break;
        case 'include':  obj.mode = 'exclude'; break;
        case 'exclude':  obj.mode = 'neutral'; break;
        default:         obj.mode = 'neutral'; break;
      }
      this.filterResources();
    }

    getClassForMode(mode) {
      switch (mode) {
        case 'include': return 'btn-success';
        case 'neutral': return 'btn-primary';
        case 'exclude': return 'btn-danger';
        default:        return 'btn-info';
      }
    }

    filterResources() {
      if (this.resources) {
        console.time('filtering resources');
        this.filteredResources = this.$filter('tagfilter')(this.resources,
                                                           this.orgs,
                                                           this.Tag.allTags,
                                                           this.selectionMode);
        if (this.resourceTextFilter) {
          this.filteredResources = this.$filter('filter')(this.filteredResources,
                                                          this.resourceTextFilter,
                                                          false // comparator, false means case insensitive.
                                                        /* , anyPropertyKey */ );
        }
        console.log('after filtering we have ', this.filteredResources.length, ' filtered resources');
        this.updateOrgCounts();
        this.updatePage();
        console.timeEnd('filtering resources');
      }
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
          this.loadResources()
          .then( () => this.filterResources() );
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
