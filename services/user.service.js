const User = require('../models/user.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const bcrypt = require('bcrypt');
const fs = require('fs');
const privateKey = fs.readFileSync('config/jwtRS256.key', 'utf8');
const publicKey = fs.readFileSync('config/jwtRS256.key.pub', 'utf8');
const jwt = require('jsonwebtoken');
exports.createUserService = async ({
  username,
  email,
  gender,
  dateOfBirth,
  image,
  address,
  phoneNumber,
  password,
  companyInfo
}) => {
  try {
    let oldUser = await User.findOne({ email: email });
    companyInfo = JSON.parse(companyInfo)
    if (oldUser) {
      let duplicateError = new Error('Already exist with this email');
      duplicateError.status = 400;
      throw duplicateError;
    } else {
      const user = new User({
        username,
        email,
        gender,
        dateOfBirth,
        image,
        address,
        phoneNumber,
        password,
        companyInfo
      });
      user.password = await updateHash(password);
      await user.save();
      return { message: 'Successfully created' };
    }
  } catch (error) {
    throw error;
  }
};
exports.getUserService = async () => {
  try {
    // sortDirection = sortDirection === 'desc' ? -1 : 1;
    // page = parseInt(page);
    // limit = parseInt(limit);
    // const skip = (page - 1) * limit;
    // let searchQuery = {
    //   $match: {},
    // };
    // if (search) {
    //   searchQuery = {
    //     $match: {
    //       $or: [
    //         {
    //           username: {
    //             $regex: search,
    //             $options: 'i',
    //           },
    //         },
    //         {
    //           email: {
    //             $regex: search,
    //             $options: 'i',
    //           },
    //         },
    //         {
    //           phoneNumber: {
    //             $regex: search,
    //             $options: 'i',
    //           },
    //         },
    //       ],
    //     },
    //   };
    // }
    // let sortQuery = {
    //   $sort: {
    //     createdDate: -1,
    //   },
    // };
    // if (sortColumn === 'username') {
    //   sortQuery = {
    //     $sort: {
    //       username: sortDirection,
    //     },
    //   };
    // } else if (sortColumn === 'email') {
    //   sortQuery = {
    //     $sort: {
    //       email: sortDirection,
    //     },
    //   };
    // } else if (sortColumn === 'createdDate') {
    //   sortQuery = {
    //     $sort: {
    //       createdDate: sortDirection,
    //     },
    //   };
    // } else if (sortColumn === 'phoneNumber') {
    //   sortQuery = {
    //     $sort: {
    //       phoneNumber: sortDirection,
    //     },
    //   };
    // }
    let result = await User.aggregate([
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: 1,
          email: 1,
          gender: 1,
          dateOfBirth: 1,
          image: 1,
          address: 1,
          phoneNumber: 1,
          companyInfo:1
        },
      },
    ]);
    let response = {};
    // const { users, totalCount } = result[0];
    response.users = result;
    response.totalCount = result.length;
    return response;
  } catch (error) {
    throw error;
  }
};
exports.updateUserService = async ({
  username,
  email,
  gender,
  dateOfBirth,
  image,
  address,
  phoneNumber,
  password,
  companyInfo,
  userId
}) => {
  try {
    companyInfo = JSON.parse(companyInfo)
    let updateData = image
      ? {
        username,
        email,
        gender,
        dateOfBirth,
        image,
        address,
        phoneNumber,
        password,
        companyInfo
        }
      : {
        username,
        email,
        gender,
        dateOfBirth,
        address,
        phoneNumber,
        password,
        companyInfo
        };
    let updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (password) {
      updateUser.password = await updateHash(password);
    }
    await updateUser.save();
    
    return { message: 'Succesfully Updated' };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.detailUserService = async ({ userId }) => {
  try {
    console.log('in detail');
    let result = await User.aggregate([
      {
        $match: { _id: ObjectId(userId) },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username:1,
          email:1,
          gender:1,
          dateOfBirth:1,
          address:1,
          phoneNumber:1,
          password:1,
          companyInfo:1
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
exports.deleteUserService = async ({ userId }) => {
  try {
    await User.deleteOne({ _id: ObjectId(userId) });
    return { message: 'Successfully Deleted' };
  } catch (error) {
    throw error;
  }
};

exports.loginService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { _id: userId } = user;

      const token = jwt.sign(
        {
          userId,
        },
        privateKey,
        {
          algorithm: 'RS256',
        }
      );
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return {
          message: 'Successfully Login',
          user: user,
          token,
        };
      } else {
        let passwordWrong = new Error('Password is wrong.');
        passwordWrong.status = 400;
        throw passwordWrong;
      }
    } else {
      let notFoundError = new Error('User does not exist with this email');
      notFoundError.status = 400;
      throw notFoundError;
    }
  } catch (error) {
    console.log(error);
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