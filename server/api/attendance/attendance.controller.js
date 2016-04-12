/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/attendances              ->  index
 * POST    /api/attendances              ->  create
 * GET     /api/attendances/:id          ->  show
 * PUT     /api/attendances/:id          ->  update
 * DELETE  /api/attendances/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Attendance from './attendance.model';
import * as UserController from '../user/user.controller';

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

// Gets a list of Attendances
export function index(req, res) {
  return Attendance.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Attendance from the DB
export function show(req, res) {
  return Attendance.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Attendance in the DB
export function create(req, res) {
  return Attendance.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Attendance in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Attendance.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Attendance from the DB
export function destroy(req, res) {
  return Attendance.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Sets the attendance for a set of students
export function quickSet(req, res) {
  console.log('quickSet:', JSON.stringify(req.body));
  let students = req.body.students;
  students.forEach((student) => {
    var newAttendance = {
      date: new Date(req.body.date),
      value: req.body.value
    };

    // do a parallel update of all student attendances
    let promises = [];
    students.forEach((student) => {
      promises.push(UserController.changeAttendanceHelper(student, newAttendance));
    });
    console.log('promises:', promises.length);
    Promise.all(promises)
    .then((updatedStudents) => {
      console.log('finished updating %d students', updatedStudents.length);
      console.log('updatedStudents:', JSON.stringify(updatedStudents));
      res.status(201).json({ students: updatedStudents });
      console.log('Done!');
      return null;
    });
  });
}
