const Project = require("../models/project.model");
const Feature = require("../models/features.model");
const Phase = require("../models/phase.model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const bcrypt = require("bcrypt");
const fs = require("fs");
const privateKey = fs.readFileSync("config/jwtRS256.key", "utf8");
const publicKey = fs.readFileSync("config/jwtRS256.key.pub", "utf8");
const jwt = require("jsonwebtoken");
exports.createProjectService = async ({
  name,
  startDate,
  targetEndDate,
  budget,
  status,
  projectOwner,
}) => {
  try {
    const user = new Project({
      name,
      startDate,
      targetEndDate,
      budget,
      status,
      projectOwner,
    });
    await user.save();
    return { message: "Successfully created", projectId: user._id };
  } catch (error) {
    throw error;
  }
};
exports.getProjectService = async ({ search, page, limit }) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    let searchQuery = {
      $match: {},
    };
    if (search) {
      searchQuery = {
        $match: {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              projectOwner: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      };
    }
    let sortQuery = {
      $sort: {
        createdDate: -1,
      },
    };

    let result = await Project.aggregate([
      searchQuery,
      sortQuery,
      {
        $lookup: {
          from: "phases",
          let: { projectId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$projectId", "$$projectId"],
                },
              },
            },
            {
              $lookup: {
                from: "features",
                let: { features: "$features" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$_id", "$$features"] },
                    },
                  },
                ],
                as: "feature",
              },
            },
          ],
          as: "phase",
        },
      },

      {
        $project: {
          _id: 0,
          projectId:'$_id',
          name:1,
          startDate:1,
          targetEndDate:1,
          budget:1,
          status:1,
          projectOwner:1,
          phase:1
        },
      },
      {
        $facet: {
          projects: [
            { $skip: parseInt(skip, 10) },
            { $limit: parseInt(limit, 10) },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    let response = {};
    const { projects, totalCount } = result[0];
    response.projects = projects;
    response.totalCount = totalCount[0] ? totalCount[0].count : 0;
    return response;
  } catch (error) {
    throw error;
  }
};
exports.updateProjectService = async ({ features, phases, projectId }) => {
  try {
    features = features.map((feature) => {
      feature.projectId = projectId;
      return feature;
    });
    phases = phases.map((phase) => {
      phase.projectId = projectId;
      return phase;
    });
    if (features.length) {
      await Feature.insertMany(features);
      features = Feature.find(
        { projectId: ObjectId(projectId) },
        { _id: 1, name: 1 }
      );
    }
    if (phases.length) {
      await Phase.insertMany(phases);
    }

    return features.length
      ? { message: "Succesfully Updated", features }
      : { message: "Succesfully Updated" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.detailProjectService = async ({ userId }) => {
  try {
    console.log("in detail");
    let result = await Project.aggregate([
      {
        $match: { _id: ObjectId(userId) },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: 1,
          email: 1,
          gender: 1,
          dateOfBirth: 1,
          address: 1,
          phoneNumber: 1,
          password: 1,
          companyInfo: 1,
        },
      },
    ]).exec();
    let user = result[0];
    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.deleteProjectService = async ({ userId }) => {
  try {
    await Project.deleteOne({ _id: ObjectId(userId) });
    return { message: "Successfully Deleted" };
  } catch (error) {
    throw error;
  }
};

function updateHash(password) {
  try {
    return new Promise((resolve, reject) => {
      const hash = bcrypt.hashSync(password, 13);
      resolve(hash);
    });
  } catch (err) {
    throw err;
  }
}
