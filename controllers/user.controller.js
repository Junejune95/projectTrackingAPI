const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');
const {
  createUserService,
  getUserService,
  updateUserService,
  detailUserService,
  deleteUserService,
  loginService,
} = require('../services/user.service');
exports.createUserController = async (req, res, next) => {
  let {
    username,
    email,
    gender,
    dateOfBirth,
    image,
    address,
    phoneNumber,
    password,
    companyInfo
  } = req.body;
  try {
    var imagepath = path.join(__dirname, '../public/uploads/profileImage/');
    const host = req.headers.host;
    const imageType =
      req.file && req.file.mimetype === 'image/png'
        ? '.png'
        : req.file && req.file.mimetype === '.jpg'
        ? '.jpg'
        : '.jpeg';
    const imageName = req.file
      ? req.uploadfilename.split('.blob')[0] + imageType
      : '';
    image = req.file
      ? req.protocol +
        '://' +
        host +
        '/public/uploads/profileImage/' +
        imageName
      : '';
    if (req.file) {
      let profileImage = await Jimp.read(imagepath + req.uploadfilename);
      await profileImage.write(imagepath + imageName);
      fs.unlinkSync(imagepath + req.uploadfilename);
    }

    await createUserService({
      username,
      email,
      gender,
      dateOfBirth,
      image,
      address,
      phoneNumber,
      password,
      companyInfo,

    });
    res.status(200).send({ message: 'Successfully Created' });
  } catch (error) {
    next(error);
  }
};
exports.getUserController = async (req, res, next) => {
  try {

    let response = await getUserService();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
exports.updateUserController = async (req, res, next) => {
  let {
    username,
    email,
    gender,
    dateOfBirth,
    address,
    phoneNumber,
    password,
    companyInfo,
    userId
  } = { ...req.body, ...req.params };
  try {
    var imagepath = path.join(__dirname, '../public/uploads/profileImage/');
    const host = req.headers.host;
    console.log(req.file);
    const imageType =
      req.file && req.file.mimetype === 'image/png'
        ? '.png'
        : req.file && req.file.mimetype === '.jpg'
        ? '.jpg'
        : '.jpeg';
    const imageName = req.file
      ? req.uploadfilename.split('.blob')[0] + imageType
      : '';
    image = req.file
      ? req.protocol +
        '://' +
        host +
        '/public/uploads/profileImage/' +
        imageName
      : '';
    if (req.file) {
      let profileImage = await Jimp.read(imagepath + req.uploadfilename);
      await profileImage.write(imagepath + imageName);
      fs.unlinkSync(imagepath + req.uploadfilename);
    }
    await updateUserService({
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
    });
    res.status(200).send({ message: 'Successfully Updated' });
  } catch (error) {
    next(error);
  }
};
exports.detailUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    let response = await detailUserService({
      userId,
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
exports.deleteUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await deleteUserService({
      userId,
    });
    res.status(200).send({ message: 'Successfully Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const response = await loginService({ email, password });
    res.json(response);
  } catch (error) {
    next(error);
  }
};