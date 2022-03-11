const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const schema = {
  name:String,
  startDate:String,
  targetEndDate:String,
  budget:String,
  status:String,
  projectOwner:String
};
const UserSchema = new Schema(schema, {
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
});

module.exports = mongoose.model('PROJECT', UserSchema);
