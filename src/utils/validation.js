/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid, false otherwise
 */
export function isValidEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
}

/**
 * Validate user registration data
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateUserData(userData) {
  const errors = {};
  
  if (!userData.username || userData.username.trim() === '') {
    errors.username = 'Username is required';
  }
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Valid email is required';
  }
  
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  if (!userData.role || !['senior', 'junior'].includes(userData.role)) {
    errors.role = 'Role must be either senior or junior';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate user profile update data
 * @param {Object} userData - User data to validate for profile update
 * @returns {Object} Validation result with valid flag and errors
 */
export function validateUserUpdate(userData) {
  const errors = {};
  
  // Username validation (if provided)
  if (userData.username !== undefined && userData.username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }
  
  // Email validation (if provided)
  if (userData.email !== undefined && !isValidEmail(userData.email)) {
    errors.email = 'Valid email is required';
  }
  
  // Role validation (if provided)
  if (userData.role !== undefined && !['senior', 'junior'].includes(userData.role)) {
    errors.role = 'Role must be either senior or junior';
  }
  
  // Skills validation (if provided)
  if (userData.skills !== undefined) {
    if (!Array.isArray(userData.skills)) {
      errors.skills = 'Skills must be an array';
    } else if (userData.skills.some(skill => typeof skill !== 'string')) {
      errors.skills = 'All skills must be strings';
    }
  }
  
  // Bio validation (if provided)
  if (userData.bio !== undefined && userData.bio.length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
