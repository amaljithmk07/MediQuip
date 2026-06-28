const authService = require('./auth.service');
const googleService = require('./google.service');
const tokenService = require('./token.service');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.loginWithEmailAndPassword(email, password);

      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(user, deviceInfo);

      tokenService.setTokenCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        loginId: user._id,
        userRole: user.role,
        email: user.email,
        message: 'Login Successful',
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
      });
    }
  }

  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: 'No Google token provided' });
      }

      const payload = await googleService.verifyIdToken(token);
      const user = await googleService.handleGoogleLogin(payload);

      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(user, deviceInfo);

      tokenService.setTokenCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Google Auth successful',
        userRole: user.role,
        loginId: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error('Google auth error:', error);
      return res
        .status(401)
        .json({ success: false, message: error.message || 'Google authentication failed' });
    }
  }

  async refresh(req, res) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token provided' });
      }

      // 1. Validate the old refresh token (throws if invalid, expired, or revoked)
      const tokenDoc = await tokenService.validateRefreshToken(oldRefreshToken);

      // 2. Invalidate/Revoke the old refresh token (Single-Use Rotation)
      await tokenService.revokeToken(oldRefreshToken);

      // 3. Get the user object
      const loginSchema = require('../models/loginschema');
      const user = await loginSchema.findById(tokenDoc.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // 4. Issue new pair of tokens
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const accessToken = tokenService.generateAccessToken(user);
      const newRefreshToken = await tokenService.generateRefreshToken(user, deviceInfo);

      tokenService.setTokenCookies(res, accessToken, newRefreshToken);

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        userRole: user.role,
      });
    } catch (error) {
      // If validation fails or token is revoked, clear cookies for security
      tokenService.clearTokenCookies(res);
      return res
        .status(403)
        .json({ success: false, message: error.message || 'Invalid refresh token' });
    }
  }

  async logout(req, res) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
      if (oldRefreshToken) {
        await tokenService.revokeToken(oldRefreshToken);
      }

      tokenService.clearTokenCookies(res);
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error during logout' });
    }
  }

  async uuidVerify(req, res) {
    try {
      const userid = req.userData.userId;
      const register = require('../models/registerschema');
      const userdata = await register.findOne({ login_id: userid });

      if (!userdata) {
        return res.status(404).json({ success: false, message: 'User profile not found' });
      }

      if (userdata.user_id === req.body.user_id) {
        return res.status(200).json({
          success: true,
          message: 'Success',
          uuid: req.body.user_id,
        });
      } else {
        return res.status(400).json({ success: false, message: 'Wrong UUID' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async authTime(req, res) {
    try {
      return res.status(200).json({ success: true, message: 'Session Valid' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Session Time Out' });
    }
  }
}

module.exports = new AuthController();
