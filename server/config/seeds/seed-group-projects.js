import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import GroupProject from '../../api/group-project/group-project.model';
import Project from '../../api/project/project.model';
import User from '../../api/user/user.model';
import Cohort from '../../api/cohort/cohort.model';

export function createTestGroupProjects() {
  return GroupProject.find({}).remove()
  .then(() => {
    User.find( { name: { $in: ['Student1', 'Student4', 'Student7'] } } )
    .then( team => {
      console.log('team size:', team.length);
      let project = new Project( {
        num: 3,
        title: 'Sample Group Project',
        info: 'Just another group project',
        githubUrl: 'https://github.com/drmikeh/duck-hunt',
        deploymentUrl: 'http://juggler-horse-43246.bitballoon.com/',
        score: 9,
        comments: 'Great Job!'
      });
      return Cohort.findOne({name: 'Test Cohort #1'})
      .then((testCohort1) => {
        return GroupProject.create( {
          name: 'Sample Team Project',
          cohort: testCohort1,
          project: project,
          team: team
        });
      });
    })
    .then( () => {
      return GroupProject.find({}).populate('team');
    })
    .then( groupProjects => {
      console.log('groupProjects:', groupProjects.map( p => {
        return { project: p.project, team: p.team.map( u => u.name ) };
      }));
      return User.findOne({ name: 'Student4' }).fill('groupProjects');
    })
    .then( student4 => {
      // console.log(`student4 id = ${student4._id}, groupProjects:`, student4.groupProjects);
      // console.log('student4:', student4);
      return null;
    });
  });
}
