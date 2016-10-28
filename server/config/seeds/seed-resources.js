import fs from 'fs';
import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Resource from '../../api/resource/resource.model';
import ResourceOrg from '../../api/resource-org/resource-org.model';

export function removeResources() {
  return Resource.find({}).remove();
}

function lookupOrg(orgs, name) {
  let found = orgs.filter(o => o.name === name);
  return found.length > 0 ? found[0] : null;
}

export function createResources(fileName) {
  ResourceOrg.find({})
  .then( resourceOrgs => {
    let resources = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    console.log(`Read ${resources.length} resources from ${fileName}`);
    resources = resources.map( r => {
      r.org = lookupOrg(resourceOrgs, r.org);  // convert org name to org object
      return r;
    });
    return Resource.create(resources)
    .then((saved) => {
      // console.log('resources:', resources.map( r => {
      //   return { title: r.title, url: r.url, tags: r.tags.join(',') };
      // }));
      console.log('finished populating %d resources', saved.length);
      return null;
    });
  });
}
