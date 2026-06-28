const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true
  },
  tokenHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  deviceInfo: {
    type: String,
    default: 'Unknown Device'
  }
}, { timestamps: true });

// Optional: Automatically delete expired tokens using a TTL index
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
