const errorCodes = require('./errorCodes');

const errorMessages = {
  invalidId: 'Id must be a number!',
  noSaleFound: 'No sale was found',
  saleNotFound: 'Sale not found',
};

const errorObjects = {
  invalidId: {
    error: { code: errorCodes.BAD_REQUEST, message: errorMessages.invalidId },
  },
  noSaleFound: {
    error: { code: errorCodes.NOT_FOUND, message: errorMessages.noSaleFound },
  },
  saleNotFound: {
    error: { code: errorCodes.NOT_FOUND, message: errorMessages.saleNotFound },
  },
};

module.exports = { errorMessages, errorObjects };
