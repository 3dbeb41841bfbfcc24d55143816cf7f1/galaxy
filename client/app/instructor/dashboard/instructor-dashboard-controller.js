'use strict';

(function() {

  class InstructorDashboardController {
    constructor($http, $scope, socket, Auth, $filter) {
      console.log('InstructorDashboardController is alive!');

      this.$http = $http;
      this.socket = socket;

      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;

      // TODO: sample data
      this.cohorts = [
        {
          _id: 1,
          name: 'ATL WDI #5',
          students: [
            { name: 'Tony Stark', age: 21 },
            { name: 'Elon Musk', age: 39 },
            { name: 'Steve Jobs', age: 44 }
          ]
        },
        {
          _id: 2,
          name: 'ATL WDI #6',
          students: [
            { name: 'Clark Kent', age: 27 },
            { name: 'Bruce Wayne', age: 33 },
            { name: 'Oliver Queen', age: 24 },
            { name: 'Barbara Gordon', age: 22 },
            { name: 'Barry Allen', age: 21 }
          ]
        }
      ];

      this.selectedCohort = this.cohorts[0];

      this.showCohort = function() {
        var selected = $filter('filter')(this.cohorts, {_id: this.selectedCohort._id});
        return (this.selectedCohort && selected.length) ? selected[0].name : 'Not set';
      };
    }
  }

  angular.module('galaxyApp')
  .component('instructorDashboard', {
    templateUrl: 'app/instructor/dashboard/instructor-dashboard.html',
    controller: InstructorDashboardController
  });

})();
