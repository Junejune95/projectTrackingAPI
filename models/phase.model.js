const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const schema = {
  name:String,
  startDate:String,
  devEndDate:String,
  testStartDate:String,
  testEndDate:String,
  releaseDate:String,
  amount:String,
  features:[ObjectId],
  projectId:ObjectId
};
const UserSchema = new Schema(schema, {
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
});

module.exports = mongoose.model('PHASE', UserSchema);
