'use strict';

(function() {

  class Homework {

    constructor($http, Cohort) {
      console.log('Homework is alive!');
      this.$http = $http;
      this.Cohort = Cohort;
      this.getHomeworks();
    }

    // TODO: handle newly created homeworks
    getHomeworks() {
      let theCohort = this.Cohort.getCurrentCohort();
      let cohortId = theCohort ? theCohort._id : undefined;
      let promise = this.$http.get('/api/homeworks',
                                   { params: { cohort: cohortId } } );
      promise.then(response => {
        this.homeworks = response.data;
        // convert string dates to Date objects.
        this.homeworks.forEach(homework => {
          homework.assignedOnDate = new Date(homework.assignedOnDate);
          homework.dueDate = new Date(homework.dueDate);
        });
      });
      return promise;
    }

    save(homework) {
      if (homework._id) {
        let promise = this.$http.put('/api/homeworks/' + homework._id, homework);
        promise.then(response => {
          let updated = response.data;
          let found = _.find(this.homeworks, hwk => { return hwk._id === updated._id; });
          let index = this.homeworks.indexOf(found);
          this.homeworks[index] = response.data;
        });
        return promise;
      }
      else {
        let promise = this.$http.post('/api/homeworks', homework);
        promise.then(response => {
          // this.homeworks.push(response.data);
        });
        return promise;
      }
    }

    remove(homework) {
      let promise = this.$http.delete('/api/homeworks/' + homework._id);
      promise.then(() => {
        this.homeworks.splice(this.homeworks.indexOf(homework), 1);
      });
      return promise;
    }
  }

  angular.module('galaxyApp.admin')
  .service('Homework', Homework);

})();
