/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/squads              ->  index
 * POST    /api/squads              ->  create
 * GET     /api/squads/:id          ->  show
 * PUT     /api/squads/:id          ->  update
 * DELETE  /api/squads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Squad from './squad.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Squads
export function index(req, res) {
  return Squad.find().fill('studentCount').sort('name')
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single Squad from the DB
export function show(req, res) {
  return Squad.findById(req.params.id).fill('studentCount').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Squad in the DB
export function create(req, res) {
  return Squad.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Squad in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Squad.findById(req.params.id).fill('studentCount').exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Squad from the DB
export function destroy(req, res) {
  return Squad.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
