import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : req.cookies.token;
    if (!token) throw new ApiError(401, 'Authentication required');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) throw new ApiError(401, 'Invalid session');
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Invalid or expired token'));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Insufficient permissions'));
  next();
};
