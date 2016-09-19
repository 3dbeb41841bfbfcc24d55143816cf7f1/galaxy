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

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

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

  console.log('req.query:', req.query);
  let filter = {};
  if (req.query.cohort) {
    filter.cohort = req.query.cohort;
  }
  console.log('groupProject index has filter:', filter);
  return GroupProject.find(filter)
  .populate('cohort')
  .populate('team', '_id name email github')
  .sort('name')
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single GroupProject from the DB
export function show(req, res) {
  return GroupProject.findById(req.params.id)
  .populate('cohort')
  .populate('team', '_id name email github')
  .exec()
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
  return GroupProject.findById(req.params.id)
  .exec()
  .then(handleEntityNotFound(res))
  .then( (res) => {
    return saveUpdates(req.body)(res);
  })
  .then( (saved) => {
    return GroupProject.findById(saved._id)
    .populate('cohort')
    .populate('team', '_id name email github')
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}

/**
 * Change a groupProject's cohort
 */
export function changeCohort(req, res, next) {
  var groupProjectId = req.params.id;
  var newCohortId = String(req.body.cohort);

  return GroupProject.findById(groupProjectId)
  .then(groupProject => {
    console.log('setting cohort for groupProject', groupProject.name, 'to', newCohortId);
    groupProject.cohort = newCohortId;
    return groupProject.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Update a project requirement (comments or score)
 */
 export function updateProjectRequirement(req, res, next) {
  var groupProjectId = req.params.id;
  var requirementId = req.params.requirementId;
  var updates = req.body;

  return GroupProject.findById(groupProjectId)
  .then(groupProject => {
    let requirement = groupProject.project.requirements.id(requirementId);

    console.log('updating requirement:', requirement);
    console.log('with updates:', updates);

    // let updated = _.merge(requirement, updates);
    requirement.score = updates.score ? updates.score : requirement.score;
    requirement.comments = updates.comments ? updates.comments : requirement.comments;

    return groupProject.save()
    .then(() => {
      res.status(200).json(groupProject);
    })
    .catch(validationError(res));
  });
}

// Deletes a GroupProject from the DB
export function destroy(req, res) {
  return GroupProject.findById(req.params.id)
  .exec()
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
