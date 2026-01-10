import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'Please define the JWT_SECRET environment variable inside .env.local'
  );
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from request headers
 * @param {Object} req - Request object
 * @returns {String|null} JWT token or null
 */
export function getTokenFromRequest(req) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
}

/**
 * Get user ID from JWT token
 * @param {String} token - JWT token
 * @returns {String|null} User ID or null
 */
export function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}
