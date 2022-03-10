const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const schema = {
  username: String,
  email: {
    type: String,
    unique: true,
  },
  gender: String,
  dateOfBirth: String,
  image: String,
  address: String, //optional
  phoneNumber: String, //optional
  password: String,
  companyName: String,
};
const UserSchema = new Schema(schema, {
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
});

module.exports = mongoose.model('USER', UserSchema);
