const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const schema = {
  name:String,
  duration:Number,
  note:String,
  subfeatures:[String],
  projectId:ObjectId
};
const UserSchema = new Schema(schema, {
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
});

module.exports = mongoose.model('FEATURE', UserSchema);
