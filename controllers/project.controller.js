const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const {
  createProjectService,
  getProjectService,
  updateProjectService,
  detailProjectService,
  deleteProjectService,
} = require("../services/project.service");
exports.createProjectController = async (req, res, next) => {
  let { basicInfo } = req.body;
  try {
    const { name, startDate, targetEndDate, budget, status, projectOwner } =
      basicInfo;

    const response = await createProjectService({
      name,
      startDate,
      targetEndDate,
      budget,
      status,
      projectOwner,
    });
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
exports.getProjectController = async (req, res, next) => {
  try {
    const { search, page = "1", limit = "10" } = req.query;
    let response = await getProjectService({
      search,
      page,
      limit,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
exports.updateProjectController = async (req, res, next) => {
  let { features=[], phases=[], projectId } = { ...req.body, ...req.params };
  try {
    console.log(features, phases);
    await updateProjectService({
      features,
      phases,
      projectId,
    });
    res.status(200).send({ message: "Successfully Updated" });
  } catch (error) {
    next(error);
  }
};
exports.detailProjectController = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    let response = await detailProjectService({
      projectId,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
exports.deleteProjectController = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    await deleteProjectService({
      projectId,
    });
    res.status(200).send({ message: "Successfully Deleted" });
  } catch (error) {
    next(error);
  }
};
