const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noSaleFound: 'No sale was found',
  saleNotFound: 'Sale not found',
  internalServerError: 'Internal Server Error',
  productIdIsRequired: '"productId" is required',
  quantityIsRequired: '"quantity" is required',
  quantityGraterThanZero: '"quantity" must be greater than or equal to 1',
  saleAlreadyExists: 'Sale already exists',
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
  productIdIsRequired: {
    error: { code: httpCodes.BAD_REQUEST, message: errorMessages.productIdIsRequired },
  },
  quantityIsRequired: {
    error: { code: httpCodes.BAD_REQUEST, message: errorMessages.quantityIsRequired },
  },
  quantityGraterThanZero: {
    error: {
      code: httpCodes.UNPROCESSABLE_ENTITY,
      message: errorMessages.quantityGraterThanZero,
    },
  },
  saleAlreadyExists: {
    error: { code: httpCodes.CONFLICT, message: errorMessages.saleAlreadyExists },
  },
};

module.exports = { errorMessages, errorObjects };
