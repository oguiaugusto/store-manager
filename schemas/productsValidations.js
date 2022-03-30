const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noProductFound: 'No product was found',
  productNotFound: 'Product not found',
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
};

module.exports = { errorMessages, errorObjects };
