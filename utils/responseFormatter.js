// utils/responseFormatter.js

/**
 * Format a success response
 * @param {string} message - A brief success message
 * @param {any} responseData - Optional response data
 * @returns {object}
 */
const success = (status, message, responseData = null) => {
  return {
    status,
    message,
    responseData
  };
};

/**
 * Format an error response
 * @param {string} message - Error message to display
 * @param {number} statusCode - HTTP status code
 * @param {any} errorDetails - Optional error details for debugging
 * @returns {object}
 */
const error = (message, statusCode = 500, errorDetails = null) => {
  return {
    status:-1,
    message,
    statusCode,
    error: errorDetails,
  };
};

module.exports = {
  success,
  error,
};
