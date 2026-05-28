import User from '../models/User.js';
import Barber from '../models/Barber.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/jwt.js';

const authResponse = (res, user) => {
  const token = signToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
  const safeUser = user.toObject();
  delete safeUser.password;
  res.json({ token, user: safeUser });
};

export const register = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) throw new ApiError(409, 'Email already registered');
    const user = await User.create(req.body);
    if (user.role === 'barbero') await Barber.create({ user: user._id });
    authResponse(res, user);
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, 'Invalid credentials');
    authResponse(res, user);
  } catch (error) { next(error); }
};

export const logout = (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const profile = (req, res) => res.json(req.user);
