'use strict';

import {Router} from 'express';
import * as controller from './group-project.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/',                                auth.isAuthenticated(), controller.index);
router.get('/:id',                             auth.isAuthenticated(), controller.show);
router.post('/',                               auth.hasRole('admin'),  controller.create);
router.put('/:id',                             auth.isAuthenticated(), controller.update);
router.patch('/:id',                           auth.isAuthenticated(), controller.update);
router.put('/:id/cohort',                      auth.hasRole('admin'),  controller.changeCohort);
router.put('/:id/requirements/:requirementId', auth.hasRole('admin'),  controller.updateProjectRequirement);
router.delete('/:id',                          auth.hasRole('admin'),  controller.destroy);

module.exports = router;
