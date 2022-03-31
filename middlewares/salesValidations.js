const {
  isNull,
  isEmpty,
  isGraterThan,
} = require('../schemas/genericValidations');
const { errorObjects } = require('../schemas/salesValidations');

const salesValidations = (req, _res, next) => {
  const { name, quantity } = req.body;

  const conditionals = {
    productIdIsRequired: () => isNull(name) || isEmpty(name),
    quantityIsRequired: () => isEmpty(quantity),
    quantityGraterThanZero: () => !isGraterThan(quantity, 0),
  };
  const conditional = Object.entries(conditionals).find((c) => c[1]());

  if (conditional) return next(errorObjects[conditional[0]]);  
  return next();
};

module.exports = salesValidations;
