'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  console.log('req.query:', req.query);
  let filter = req.query.role ? {role: req.query.role} : {};
  if (req.query.cohort) {
    filter.cohort = req.query.cohort;
  }
  console.log('user index has filter:', filter);
  return User.find(filter, '-salt -password').sort('name')
    .then(users => {
      res.status(200).json(users);
      return users;
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Change a users role
 */
export function changeRole(req, res, next) {
  var userId = req.params.id;
  var newRole = String(req.body.role);

  return User.findById(userId)
  .then(user => {
    console.log('setting role for user', user.name, 'to', newRole);
    user.role = newRole;
    return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Change a users cohort
 */
export function changeCohort(req, res, next) {
  var userId = req.params.id;
  var newCohortId = String(req.body.cohort);

  return User.findById(userId)
  .then(user => {
    console.log('setting cohort for user', user.name, 'to', newCohortId);
    user.cohort = newCohortId;
    return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Change a users squad
 */
export function changeSquad(req, res, next) {
  var userId = req.params.id;
  var newSquadId = String(req.body.squad);

  return User.findById(userId)
  .then(user => {
    console.log('setting squad for user', user.name, 'to', newSquadId);
    user.squad = newSquadId;
    return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Change a users attendance
 */
export function changeAttendance(req, res, next) {
  var userId = req.params.id;
  var newAttendance = {
    date: new Date(req.body.attendance.date),
    value: req.body.attendance.value
  };

  return User.findById(userId)
  .then(user => {
    console.log('setting attendance for user', user.name, 'to', JSON.stringify(newAttendance));

    // TODO: add or change attendance value
    let oldAttendance = _.find(user.attendance, (a) => {
      console.log('comparing %s === %s', a.date, newAttendance.date);
      return a.date.getTime() === newAttendance.date.getTime();
    });
    if (oldAttendance) {
      console.log('updating oldAttendance:', JSON.stringify(oldAttendance));
      oldAttendance.value = newAttendance.value;
    }
    else {
      console.log('adding attendance:', JSON.stringify(newAttendance));
      user.attendance.push(newAttendance);
    }
    return user.save()
      .then(() => {
        res.status(204).end();
      })
      .catch(validationError(res));
  });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
