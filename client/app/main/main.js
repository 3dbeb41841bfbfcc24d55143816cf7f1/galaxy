'use strict';

angular.module('galaxyApp')
.config(function($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>',
      onEnter: function($state, Auth) {
        console.log('onEnter');
        Auth.getCurrentUser(null)
        .then(user => {
          console.log('user:', user);
          if (!user.hasOwnProperty('role')) {
            console.log('no user');
            // do nothing
          }
          else if (user.role === 'student') {
            $state.go('student.dashboard');
          }
          else {
            // TODO: change to dashboard when it is ready.
            $state.go('instructor.attendance');
          }
      });
    }
  });
});
