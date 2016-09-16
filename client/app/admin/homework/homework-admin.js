'use strict';

(function() {

  class HomeworkAdminController {
    constructor(Homework, $http, $filter, $rootScope) {
      console.log('HomeworkAdminController is alive!');
      this.Homework = Homework;
      this.$http = $http;
      this.$filter = $filter;
      this.cohorts = [];
      this.homeworks = [];
      this.loadHomeworks();

      $rootScope.$on('cohortChangeEvent', () => {
        this.loadHomeworks();
      });
    }

    setCohortInVM(homework) {
      if (!homework.cohort) {
        return;
      }
      var selected = this.$filter('filter')(this.cohorts, {_id: homework.cohort._id} );
      homework.cohort = selected.length ? selected[0] : null;
    }

    // TODO: handle newly created cohorts
    loadCohorts(homework) {
      if (this.cohorts.length) {
        this.setCohortInVM(homework);
        return null;
      }
      else {
        return this.$http.get('/api/cohorts')
        .then((response) => {
          this.cohorts = response.data;
          this.setCohortInVM(homework);
        });
      }
    }

    // TODO: handle newly created homeworks
    loadHomeworks() {
      this.Homework.getHomeworks()
      .then(() => {
        this.homeworks = this.Homework.homeworks;
      });
    }

    addHomework() {
      this.inserted = {
        name: '',
        info: null,
        startDate: null,
        active: true
      };
      this.homeworks.push(this.inserted);
    }

    enrichHomework(homework, index) {
      this.homeworks[index] = homework;
      this.setCohortInVM(homework);
    }

    saveHomework(index, data, id) {
      if (id) {
        data._id = id;
        this.Homework.save(data)
        .then(response => {
          this.enrichHomework(response.data, index);
        });
      }
      else {
        this.Homework.save(data)
        .then(response => {
          this.enrichHomework(response.data, index);
        });
      }
    }

    removeHomework(index, homework) {
      if (confirm('Are you sure?')) {
        this.Homework.remove(homework)
        .then(() => {
          console.log('homework deleted');
        });
      }
    }
  }

  angular.module('galaxyApp.admin')
  .component('adminHomework', {
    templateUrl: 'app/admin/homework/homework-admin.html',
    controller: HomeworkAdminController
  });

})();
