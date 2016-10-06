'use strict';

(function() {

  const defaultTags = [
    { name: 'Lesson',        mode: 'neutral' },
    { name: 'Exercise',      mode: 'neutral' },
    { name: 'WDI',           mode: 'neutral' },
    { name: 'Cheat Sheet',   mode: 'neutral' },
    { name: 'HTML',          mode: 'neutral' },
    { name: 'JavaScript',    mode: 'neutral' },
    { name: 'CSS',           mode: 'neutral' },
    { name: 'SASS',          mode: 'neutral' }
  ];

  class Tag {
    constructor() {
      this.allTags = defaultTags;
    }
  }

  angular.module('galaxyApp')
  .service('Tag', Tag);

})();
