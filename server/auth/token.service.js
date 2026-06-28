const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");

class TokenService {
  /**
   * Generates a new access token
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        userRole: user.role,
        userEmail: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );
  }

  /**
   * Generates a new refresh token and saves its hash to the database
   */
  async generateRefreshToken(user, deviceInfo) {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshTokenDoc = new RefreshToken({
      userId: user._id,
      tokenHash,
      expiresAt,
      deviceInfo
    });

    await refreshTokenDoc.save();

    return rawToken;
  }

  /**
   * Validates a refresh token against the database
   */
  async validateRefreshToken(rawToken) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenDoc = await RefreshToken.findOne({ tokenHash });

    if (!tokenDoc) {
      throw new Error("Refresh token not found");
    }

    if (tokenDoc.revoked) {
      throw new Error("Refresh token has been revoked");
    }

    if (new Date() > tokenDoc.expiresAt) {
      throw new Error("Refresh token has expired");
    }

    return tokenDoc;
  }

  /**
   * Revokes a specific refresh token
   */
  async revokeToken(rawToken) {
    if (!rawToken) return;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await RefreshToken.findOneAndUpdate({ tokenHash }, { revoked: true });
  }

  /**
   * Sets the HTTP-Only cookies for the tokens
   */
  setTokenCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 min
    });

    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
  }

  clearTokenCookies(res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}

module.exports = new TokenService();
