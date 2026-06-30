const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentschema = new Schema({
  request_id: { type: Schema.Types.ObjectId, ref: 'orders_tb', required: true },
  amount: { type: Number, required: true },
  screenshotUrl: { type: String, required: true },
  donorConfirmed: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Submitted', 'Verified', 'Rejected', 'Expired'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Paymentdata = mongoose.model('payment_tb', paymentschema);
module.exports = Paymentdata;
