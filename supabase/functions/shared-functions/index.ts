// Export all shared functions
// Cors utilities
export { corsHeaders, addCorsHeaders, handleCorsPreflightRequest } from '../_shared/cors'

// Error handling
export { errorResponse, notFoundError, validationError, authenticationError, authorizationError } from '../_shared/errors'

// Authentication
export { authenticate, verifyAdmin } from '../_shared/auth'

// Validation
export { validateInput, validatePagination, extractId } from '../_shared/validation'
export type { ValidationSchema } from '../_shared/validation' 