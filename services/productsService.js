const productsModel = require('../models/productsModel');
const { errorObjects } = require('../schemas/productsValidations');
const validations = require('../schemas/genericValidations');

const listAll = async () => {
  const products = await productsModel.listAll();

  if (products instanceof Error) return errorObjects.internalServerError;
  if (validations.isNull(products)) return errorObjects.noProductFound;

  return products;
};

const listById = async (id) => {
  if (!validations.isANumber(id) || validations.isNull(id)) return errorObjects.invalidId;

  const product = await productsModel.listById(id);

  if (product instanceof Error) return errorObjects.internalServerError;
  if (validations.isNull(product)) return errorObjects.productNotFound;

  return product;
};

module.exports = {
  listAll,
  listById,
};
