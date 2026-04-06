import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import Session from '../models/Session.model.js';
import { generateAccessToken, generateRefreshToken, hashToken } from '../utils/tokens.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

// register controller
export async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;

    const errors = {};

    if (!username) errors.username = 'Username is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (!role) {
      errors.role = 'Role is required';
    } else if (role !== 'user' && role !== 'seller') {
      errors.role = 'Role must be either user or seller';
    }

    if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (password && password.length > 16)
      errors.password = 'Password must not exceed 16 characters';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // hash passoword
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, role });

    // save user to database
    await user.save();
    return res.status(201).json({ message: 'user created' });
  } catch (err) {
    console.log(req.body);
    // check if username or email already exists
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        message: `${field} already exists`,
      });
    }

    // check username or email validation
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    // any other error
    console.error('error in register controller', err);
    return res.status(500).json({ message: 'Internal Server error.' });
  }
}

// login controller
export async function login(req, res) {
  try {
    const { username, email, password } = req.body;

    // get either username or email bot both
    if (username && email) {
      return res.status(401).json({ message: 'provide either a username or an email, not both' });
    }

    // check either username or email is provided
    if (!username && !email) {
      return res.status(401).json({ message: 'must provide either a username or an email' });
    }

    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }

    // find user in database
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    // check if user exists
    if (!user) {
      return res.status(404).json({ message: 'user does not exist' });
    }

    // check user password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    //generate accessToken and refreshToken
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // hash refreshToken
    const hashedRefreshToken = hashToken(refreshToken);

    // create a session
    const session = new Session({
      userId: user._id,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await session.save();
    // give refreshToken to user in httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'login successful',
      accessToken,
    });
  } catch (err) {
    // any other error
    console.error('error in login controller', err);
    return res.status(500).json({ message: 'Internal Server error.' });
  }
}

// refresh controller
export async function refresh(req, res) {
  try {
    // get refresh token
    const refreshToken = req.cookies.refreshToken;

    // check if refresh token is proivided
    if (!refreshToken) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    // verify refresh token
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'invalid refresh token' });
    }

    // hash refresh token to check in db
    const newhashedRefreshToken = hashToken(refreshToken);

    // find session
    const session = await Session.findOne({
      userId: decoded.id,
      refreshToken: newhashedRefreshToken,
    });

    // token reuse detection
    if (!session) {
      await Session.deleteMany({ userId: decoded.id });

      // logout from all devices
      return res.status(403).json({ message: 'Session compromised. Please login again.' });
    }

    // delete old session
    await Session.deleteOne({ _id: session._id });

    // generate new tokens
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.id, decoded.role);

    // hash new refresh token
    const newHashedRefreshToken = hashToken(newRefreshToken);

    // create new session
    await Session.create({
      userId: decoded.id,
      refreshToken: newHashedRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // give new refresh token to user in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // give new access token to user
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error('error in refresh controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}

// single device logout
export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    // delete session
    if (refreshToken) {
      await Session.deleteOne({ refreshToken: hashToken(refreshToken) });
    }

    // clear cookie
    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('error in logout controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}

// all devices logout
export async function logoutAll(req, res) {
  try {
    await Session.deleteMany({
      userId: req.user.id,
    });

    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    console.error('error in logoutAll controller', err);
    return res.status(500).json({ message: 'internal server error' });
  }
}

// get current user
export async function getCurrentUser(req, res) {
  try {
    // req.user is set by authMiddleware
    const userId = req.user.id;

    // fetch user from DB, exclude password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('error in getCurrentUser controller', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
