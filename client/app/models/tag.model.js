'use strict';

(function() {

  // const defaultTags = [
  //   { name: 'Lesson' },
  //   { name: 'Exercise' },
  //   { name: 'WDI' },
  //   { name: 'Cheat Sheet' },
  //   { name: 'HTML' },
  //   { name: 'JavaScript' },
  //   { name: 'CSS' },
  //   { name: 'SASS' }
  // ];

  const defaultTags = [ 'Lesson', 'Exercise', 'WDI', 'Cheat Sheet', 'HTML', 'JavaScript', 'CSS', 'SASS' ];

  class Tag {
    constructor() {
      this.allTags = defaultTags;
    }
  }

  angular.module('galaxyApp')
  .service('Tag', Tag);

})();
