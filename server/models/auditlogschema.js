const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditlogschema = new Schema({
  actor_id: { type: Schema.Types.ObjectId, ref: 'login_tb', required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId },
  entityModel: { type: String },
  metadata: { type: Schema.Types.Mixed }, // flexible object for storing old/new states
  createdAt: { type: Date, default: Date.now }
});

const Auditlogdata = mongoose.model('auditlog_tb', auditlogschema);
module.exports = Auditlogdata;
