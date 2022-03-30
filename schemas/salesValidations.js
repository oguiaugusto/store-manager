const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noSaleFound: 'No sale was found',
  saleNotFound: 'Sale not found',
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
};

module.exports = { errorMessages, errorObjects };
