const express = require('express');
const { createProjectController, getProjectController, updateProjectController } = require('../controllers/project.controller');
const router = express.Router();
const baseURL = '/api/v1';


/**
 * user create & get
 */
router
  .route(`${baseURL}/projects`)
  .post(createProjectController)
  .get(getProjectController);
/**
 *
 * user detail delete update
 */
router
  .route(`${baseURL}/projects/:projectId`)
  .put(updateProjectController)
  // .get(detailUserController)
  // .delete(deleteUserController);
exports.default = (app) => {
  app.use('/', router);
};
