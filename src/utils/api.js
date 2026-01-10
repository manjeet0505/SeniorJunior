/**
 * Helper functions for API responses
 */

/**
 * Send a success response
 * @param {Object} data - Data to send in the response
 * @param {Number} status - HTTP status code
 * @returns {Response} Response object
 */
export function sendSuccess(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Send an error response
 * @param {String} message - Error message
 * @param {Number} status - HTTP status code
 * @returns {Response} Response object
 */
export function sendError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Parse request body as JSON
 * @param {Request} request - Request object
 * @returns {Promise<Object>} Parsed JSON body
 */
export async function parseRequestBody(request) {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid request body');
  }
}
