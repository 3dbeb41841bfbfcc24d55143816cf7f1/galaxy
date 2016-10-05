'use strict';

import mongoose from 'mongoose';

var ResourceSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    info:      String,
    url:       String,
    tags:      [String],
    rating:    { type: Number, min: 0, max: 5 },
    upvotes:   { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  },
  { timestamps: true }  // createdAt, updatedAt
);

function date2String(date) {
  let options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

ResourceSchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

ResourceSchema.methods.getUpdatedAt = function() {
  return date2String(this.updatedAt);
};

export default mongoose.model('Resource', ResourceSchema);
