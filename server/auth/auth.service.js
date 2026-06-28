const bcrypt = require('bcryptjs');
const loginSchema = require('../models/loginschema');
const VolunteerDB = require('../models/volunteerRegisterschema');
const { default: mongoose } = require('mongoose');

class AuthService {
  /**
   * Authenticates a user using email and password
   */
  async loginWithEmailAndPassword(email, password) {
    if (!email || !password) {
      throw new Error('All fields are required!');
    }

    const loweremail = email.toLowerCase();
    const user = await loginSchema.findOne({ email: loweremail });

    if (!user) {
      throw new Error("Email doesn't exist");
    }

    // Role 3 (Volunteer) approval check
    if (user.role == 3) {
      const loginId = new mongoose.Types.ObjectId(user._id);
      const volunteer = await VolunteerDB.findOne({ login_id: loginId });

      if (!volunteer || volunteer.status !== 'Approved') {
        throw new Error('Request not approved');
      }
    }

    if (!user.password) {
      throw new Error('Please login with Google');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }

    return user;
  }
}

module.exports = new AuthService();
