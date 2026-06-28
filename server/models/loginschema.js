const mongoose = require('mongoose');
const Schema = mongoose.Schema; //schema definition

const loginschema = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  role: { type: Number, required: true },
  googleId: { type: String },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  createdAt: { type: Date, default: Date.now }
});

var Logindata = mongoose.model('login_tb', loginschema); //model creation
module.exports = Logindata;
