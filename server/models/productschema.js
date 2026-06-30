const mongoose = require('mongoose');
const Schema = mongoose.Schema; //schema definition

const productschema = new mongoose.Schema({
  image: {
    type: String,
  },
  login_id: {
    type: Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  available_qty: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  purchased_date: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pin_code: {
    type: Number,
    required: true,
  },
  wishlist: {
    type: String,
    require: true,
    default: '',
  },
  product_status: {
    type: String,
    enum: ['Pending Review', 'Available', 'Reserved', 'Transferred', 'Archived', 'Rejected'],
    default: 'Pending Review',
  },
  transferType: {
    type: String,
    enum: ['FREE', 'RECOVERY'],
    default: 'FREE'
  },
  recoveryAmount: { type: Number, default: 0 },
  estimatedValue: { type: Number, default: 0 },
  condition: { type: String, default: 'Good' },
  originalOwner: { type: Schema.Types.ObjectId, ref: 'login_tb' },
  currentHolder: { type: Schema.Types.ObjectId, ref: 'login_tb' },
  transferHistory: [{
    previousOwner: { type: Schema.Types.ObjectId, ref: 'login_tb' },
    newOwner: { type: Schema.Types.ObjectId, ref: 'login_tb' },
    date: { type: Date, default: Date.now },
    requestId: { type: Schema.Types.ObjectId, ref: 'order_tb' } // Will reference orderschema
  }],
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'login_tb' },
  verificationDate: { type: Date },
  inspectionNotes: { type: String },
  imagesAfterInspection: [{ type: String }],
});
const data = mongoose.model('Product_details', productschema);
module.exports = data;
