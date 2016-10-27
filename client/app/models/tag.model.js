'use strict';

(function() {

  class Tag {
    constructor() {
      this.allTags = [];
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
