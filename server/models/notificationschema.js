const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationschema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'login_tb', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Donation Approved', 'Payment Pending'
  read: { type: Boolean, default: false },
  relatedEntity: { type: Schema.Types.ObjectId }, // Can be equipment ID, request ID, payment ID
  entityModel: { type: String }, // e.g., 'Product_details', 'orders_tb', 'payment_tb'
  createdAt: { type: Date, default: Date.now }
});

const Notificationdata = mongoose.model('notification_tb', notificationschema);
module.exports = Notificationdata;
