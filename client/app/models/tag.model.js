'use strict';

(function() {

  const defaultTags = [
    { name: 'Lesson',        mode: 'neutral' },
    { name: 'Exercise',      mode: 'neutral' },
    { name: 'WDI',           mode: 'neutral' }
  ];

  class Tag {
    constructor() {
      this.allTags = defaultTags;
    }

    contains(tags, tagToMatch) {
      let nameToMatch = tagToMatch.name || tagToMatch;
      return tags.reduce( (acc, tag) => acc || (tag.name || tag) === nameToMatch, false);
    }

    // add tags ignoring duplicates
    addTags(tags) {
      tags.forEach( tag => {
        if (!this.contains(this.allTags, tag) ) {
          if (!tag.name) {
            tag = { name: tag, mode: 'neutral' };
          }
          this.allTags.push(tag);
        }
      });
    }
  }

  angular.module('galaxyApp')
  .service('Tag', Tag);

})();
