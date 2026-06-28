const { OAuth2Client } = require('google-auth-library');
const loginSchema = require('../models/loginschema');
const register = require('../models/registerschema');
const { default: mongoose } = require('mongoose');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
  /**
   * Verifies the Google ID token and returns the payload
   */
  async verifyIdToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  /**
   * Handles Google Identity Merging
   * - Links Google ID to existing email
   * - Creates new user if email doesn't exist
   * - Blocks unverified emails
   */
  async handleGoogleLogin(payload) {
    const { sub: googleId, email, email_verified, name } = payload;

    if (!email_verified) {
      throw new Error('Google email is not verified');
    }

    const loweremail = email.toLowerCase();
    let user = await loginSchema.findOne({ email: loweremail });

    if (user) {
      // Identity Merging
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user (Default Role 2 - User)
      user = new loginSchema({
        email: loweremail,
        role: 2,
        googleId,
        authProvider: 'google',
      });
      await user.save();

      // Create matching register profile
      const newProfile = new register({
        login_id: user._id,
        user_id: new mongoose.Types.ObjectId().toString(), // uuid
        name: name,
        email: loweremail,
      });
      await newProfile.save();
    }

    return user;
  }
}

module.exports = new GoogleService();
