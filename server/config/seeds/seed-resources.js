import fs from 'fs';
import Promise from 'bluebird';
import mongoose from 'mongoose-fill';   // mongoose-fill monkey-patches mongoose.
mongoose.Promise = Promise;

import Resource from '../../api/resource/resource.model';

export function removeResources() {
  return Resource.find({}).remove();
}

export function createResources(fileName) {
  let externalResources = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  console.log(`Read ${externalResources.length} resources from ${fileName}`)
  return Resource.create(externalResources)
  .then((saved) => {

    // console.log('resources:', resources.map( r => {
    //   return { title: r.title, url: r.url, tags: r.tags.join(',') };
    // }));
    console.log('finished populating %d resources', saved.length);
    return null;
  });
}
