const statuscode = {
    // Success Responses (2xx)
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
  
    // Client Errors (4xx)
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
  
    // Server Errors (5xx)
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  };

  const catchcode = {
     message : "Something went Wrong",
     success:false,
     status:500,
  
  }

  const notFound = {
                   message: "Not found",
                   success: false,
                   status: statuscode.NOT_FOUND
  }
  module.exports = {statuscode,catchcode, notFound};
  