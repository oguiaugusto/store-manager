const errorCodes = require('./errorCodes');

const errorMessages = {
  invalidId: 'Id must be a number!',
  noProductFound: 'No product was found',
  productNotFound: 'Product not found',
};

const errorObjects = {
  invalidId: {
    error: { code: errorCodes.BAD_REQUEST, message: errorMessages.invalidId },
  },
  noProductFound: {
    error: { code: errorCodes.NOT_FOUND, message: errorMessages.noProductFound },
  },
  productNotFound: {
    error: { code: errorCodes.NOT_FOUND, message: errorMessages.productNotFound },
  },
};

module.exports = { errorMessages, errorObjects };
