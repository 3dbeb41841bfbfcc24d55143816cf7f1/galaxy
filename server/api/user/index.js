'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
import config from '../../config/environment';

var router = new Router();

router.get('/',               auth.isAuthenticated(), controller.index);
router.delete('/:id',         auth.hasRole('admin'),  controller.destroy);
router.get('/me',             auth.isAuthenticated(), controller.me);
router.put('/:id/password',   auth.isAuthenticated(), controller.changePassword);
router.put('/:id/role',       auth.hasRole('admin'),  controller.changeRole);
router.put('/:id/cohort',     auth.hasRole('admin'),  controller.changeCohort);
router.put('/:id/squad',      auth.hasRole('admin'),  controller.changeSquad);

// Project Routes
router.get('/:id/projects',               auth.hasRole('student'), controller.getProjects);
router.post('/:id/projects',              auth.hasRole('student'), controller.addProject);
router.put('/:id/projects/:projectId',    auth.hasRole('student'), controller.updateProject);
router.delete('/:id/projects/:projectId', auth.hasRole('student'), controller.deleteProject);

// Project Requirement Routes
router.put('/:id/projects/:projectId/requirements/:requirementId', auth.hasRole('admin'), controller.updateProjectRequirement);

router.put('/:id/attendance', auth.hasRole('admin'),  controller.changeAttendance);
router.get('/:id',            auth.isAuthenticated(), controller.show);

// Only allow POST of a new user in development mode.
// Otherwise the OAuth passport handler will create the new user.
if (config.env === 'development') {
  router.post('/',                                  controller.create);
}

export default router;
