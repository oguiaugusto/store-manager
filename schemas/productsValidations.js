const httpCodes = require('./httpCodes');

const errorMessages = {
  invalidId: '"id" must be a number!',
  noProductFound: 'No product was found',
  productNotFound: 'Product not found',
  internalServerError: 'Internal Server Error',
  nameIsRequired: '"name" is required',
  nameLengthGreaterThanFour: '"name" length must be at least 5 characters long',
  quantityIsRequired: '"quantity" is required',
  quantityGraterThanZero: '"quantity" must be greater than or equal to 1',
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
  nameIsRequired: {
    error: { code: httpCodes.BAD_REQUEST, message: errorMessages.nameIsRequired },
  },
  nameLengthGreaterThanFour: {
    error: {
      code: httpCodes.UNPROCESSABLE_ENTITY,
      message: errorMessages.nameLengthGreaterThanFour,
    },
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
};

module.exports = { errorMessages, errorObjects };
