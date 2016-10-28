import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import ResourceOrg from '../../api/resource-org/resource-org.model';

export function removeResourceOrgs() {
  console.log('Removing ResourceOrgs');
  return ResourceOrg.find({}).remove();
}

export function createResourceOrgs() {

  const orgs = [
    'ATL-WDI-Curriculum',
    'ATL-WDI-Exercises',
    'GA-WDI-Lessons',
    'GA-WDI-Exercises',
    'ga-wdi-boston',
    'generalassembly-atx',
    'wdi-sea',
    'den-wdi-1',
    'den-wdi-2'
  ];

  let resourceOrgs = orgs.map( o => {
    return { name: o, url: 'https://github.com/' + o };
  });

  resourceOrgs.push( { name: 'External', url: '' } );

  console.log('Creating ResourceOrgs');

  return ResourceOrg.create(resourceOrgs)
  .then((saved) => {
    console.log('resourceOrgs:', resourceOrgs);
    // console.log('finished populating %d resources', saved.length);
    return null;
  });
}
