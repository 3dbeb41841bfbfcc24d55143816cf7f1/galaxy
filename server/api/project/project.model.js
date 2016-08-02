'use strict';

import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.

var ProjectRequirementSchema = new mongoose.Schema({
  num: Number,
  title: String,
  info: String,
  score: Number,
  comments: String
});

var ProjectRequirement = mongoose.model('ProjectRequirement', ProjectRequirementSchema);

var ProjectSchema = new mongoose.Schema({
  num: Number,
  title: String,
  info: String,
  githubUrl: String,
  deploymentUrl: String,
  comments: String,
  requirements: [ ProjectRequirement.schema ]
});

// Add a preSave hook to ensure default values for the project requirements
ProjectSchema.pre("save", function(next) {
  if ( !this.requirements || this.requirements.length === 0 ) {
    this.requirements = [];
    this.requirements.push({
      num: 1,
      title: 'Project Workflow',
      info: 'Did you complete the user stories, wireframes, task tracking, and/or ERDs, as specified above? Did you use source control as expected for the phase of the program you’re in (detailed above)?',
      score: null,
      comments: ''
    });
    this.requirements.push({
      num: 2,
      title: 'Technical Requirements',
      info: 'Did you deliver a project that met all the technical requirements? Given what the class has covered so far, did you build something that was reasonably complex?',
      score: null,
      comments: ''
    });
    this.requirements.push({
      num: 3,
      title: 'Creativity',
      info: 'Did you add a personal spin or creative element into your project submission? Did you deliver something of value to the end user?',
      score: null,
      comments: ''
    });
    this.requirements.push({
      num: 4,
      title: 'Code Quality',
      info: 'Did you follow code style guidance and best practices covered in class, such as spacing, modularity, and semantic naming? Did you comment your code as your instructors have in class?',
      score: null,
      comments: ''
    });
    this.requirements.push({
      num: 5,
      title: 'Deployment',
      info: 'Did you deploy your application to a public url using GitHub Pages or something equivalent?',
      score: null,
      comments: ''
    });
  }
  next();
});


module.exports = mongoose.model('Project', ProjectSchema);
