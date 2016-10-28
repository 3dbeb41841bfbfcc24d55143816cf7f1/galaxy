'use strict';

import mongoose from 'mongoose';

var ResourceOrgSchema = new mongoose.Schema({
  name: String,
  url: String
});

export default mongoose.model('ResourceOrg', ResourceOrgSchema);
