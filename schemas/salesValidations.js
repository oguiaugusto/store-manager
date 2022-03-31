const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noSaleFound: 'No sale was found',
  saleNotFound: 'Sale not found',
  internalServerError: 'Internal Server Error',
};

const errorObjects = {
  invalidId: {
    error: { code: httpCodes.BAD_REQUEST, message: errorMessages.invalidId },
  },
  noSaleFound: {
    error: { code: httpCodes.NOT_FOUND, message: errorMessages.noSaleFound },
  },
  saleNotFound: {
    error: { code: httpCodes.NOT_FOUND, message: errorMessages.saleNotFound },
  },
  internalServerError: {
    error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errorMessages.internalServerError },
  },
};

module.exports = { errorMessages, errorObjects };
