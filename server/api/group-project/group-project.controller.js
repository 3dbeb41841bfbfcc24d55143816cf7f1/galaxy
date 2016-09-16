/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/group-projects              ->  index
 * POST    /api/group-projects              ->  create
 * GET     /api/group-projects/:id          ->  show
 * PUT     /api/group-projects/:id          ->  update
 * DELETE  /api/group-projects/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import GroupProject from './group-project.model';

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
    updated.team = updates.team;
    console.log('updated:', updated);
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

// Gets a list of GroupProjects
export function index(req, res) {
  return GroupProject.find().populate('team', '_id name email github').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single GroupProject from the DB
export function show(req, res) {
  return GroupProject.findById(req.params.id).populate('team', '_id name email github').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new GroupProject in the DB
export function create(req, res) {
  return GroupProject.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing GroupProject in the DB
export function update(req, res) {
  console.log('groupProject: update:', req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  return GroupProject.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then((res) => {
      return saveUpdates(req.body)(res);
    })
    .then( saved => GroupProject.findById(saved._id).populate('team', '_id name email github') )
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a GroupProject from the DB
export function destroy(req, res) {
  return GroupProject.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
