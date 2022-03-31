const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noProductFound: 'No product was found',
  productNotFound: 'Product not found',
  internalServerError: 'Internal Server Error',
};

const errorObjects = {
  invalidId: {
    error: { code: httpCodes.BAD_REQUEST, message: errorMessages.invalidId },
  },
  noProductFound: {
    error: { code: httpCodes.NOT_FOUND, message: errorMessages.noProductFound },
  },
  productNotFound: {
    error: { code: httpCodes.NOT_FOUND, message: errorMessages.productNotFound },
  },
  internalServerError: {
    error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errorMessages.internalServerError },
  },
};

module.exports = { errorMessages, errorObjects };
