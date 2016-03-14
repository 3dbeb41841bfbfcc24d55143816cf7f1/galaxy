/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/settings              ->  index
 */

'use strict';

import config from '../../config/environment';

// Gets a list of Things
export function index(req, res) {
 res.status(200).json({ mode: config.env });
}
