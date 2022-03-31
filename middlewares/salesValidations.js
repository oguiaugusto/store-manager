const {
  isNull,
  isEmpty,
  isGraterThan,
} = require('../schemas/genericValidations');
const { errorObjects } = require('../schemas/salesValidations');

const salesValidations = (req, _res, next) => {
  if (!Array.isArray(req.body)) return next(errorObjects.bodyMustBeAnArray.error);

  req.body.forEach(({ productId = '', quantity = '' }) => {
    const conditionals = {
      productIdIsRequired: () => isNull(productId) || isEmpty(productId),
      quantityIsRequired: () => isEmpty(quantity),
      quantityGraterThanZero: () => !isGraterThan(quantity, 0),
    };
    const conditional = Object.entries(conditionals).find((c) => c[1]());
  
    if (conditional) return next(errorObjects[conditional[0]].error);
  });
  return next();
};

module.exports = salesValidations;
