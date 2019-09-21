// respond with JSON
const respond = (request, response, status, object, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(JSON.stringify(object));
  response.end();
};

// Checks the accepted type and then responds accordingly
const checkType = (request, response, responseJSON, status, acceptedTypes) => {
  // Return XML
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<reponse>';
    responseXML += `<message>${responseJSON.message}</message><br>`;
    if (responseJSON.id) {
      responseXML += `<id>${responseJSON.id}</id>`;
    }
    responseXML += '</response>';

    return respond(request, response, status, responseXML, 'text/xml');
  }
  // Return JSON

  return respond(request, response, status, responseJSON, 'application/json');
};

// Success
const success = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
    id: 'success',
  };
  checkType(request, response, responseJSON, 200, acceptedTypes);
};

// Bad Request
const badRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';

    checkType(request, response, responseJSON, 400, acceptedTypes);
    return;
  }
  checkType(request, response, responseJSON, 200, acceptedTypes);
};

// Unauthorized
const unauthorized = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';

    checkType(request, response, responseJSON, 401, acceptedTypes);
    return;
  }
  checkType(request, response, responseJSON, 200, acceptedTypes);
};

// Forbidden
const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };
  checkType(request, response, responseJSON, 403, acceptedTypes);
};

// Internal Server Error
const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong',
    id: 'server error',
  };
  checkType(request, response, responseJSON, 500, acceptedTypes);
};

// Not Implemented
const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content',
    id: 'not implemented',
  };
  checkType(request, response, responseJSON, 501, acceptedTypes);
};

// Not Found
const notFound = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'not found',
  };
  checkType(request, response, responseJSON, 404, acceptedTypes);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
