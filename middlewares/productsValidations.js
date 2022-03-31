const {
  isNull,
  isEmpty,
  isLongerThan,
  isGraterThan,
} = require('../schemas/genericValidations');
const { errorObjects } = require('../schemas/productsValidations');

const productsValidations = (req, _res, next) => {
  const { name, quantity } = req.body;

  const conditionals = {
    nameIsRequired: () => isNull(name) || isEmpty(name),
    nameLengthGreaterThanFour: () => !isLongerThan(name, 4),
    quantityIsRequired: () => isEmpty(quantity),
    quantityGraterThanZero: () => !isGraterThan(quantity, 0),
  };
  const conditional = Object.entries(conditionals).find((c) => c[1]());

  if (conditional) return next(errorObjects[conditional[0]]);  
  return next();
};

module.exports = productsValidations;
