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

const create = async ({ name, quantity }) => {
  const existingProduct = await productsModel.findByName(name);

  if (existingProduct instanceof Error) return errorObjects.internalServerError;
  if (existingProduct) return errorObjects.productAlreadyExists;

  const product = await productsModel.create({ name, quantity });
  if (product instanceof Error) return errorObjects.internalServerError;

  return product;
};

const update = async ({ id, name, quantity }) => {
  const existingProduct = await productsModel.listById(id);

  if (existingProduct instanceof Error) return errorObjects.internalServerError;
  if (!existingProduct) return errorObjects.productNotFound;

  const product = await productsModel.update({ id, name, quantity });
  if (product instanceof Error) return errorObjects.internalServerError;

  return product;
};

const remove = async (id) => {
  const existingProduct = await productsModel.listById(id);

  if (existingProduct instanceof Error) return errorObjects.internalServerError;
  if (!existingProduct) return errorObjects.productNotFound;

  const product = await productsModel.remove(id);
  if (product instanceof Error) return errorObjects.internalServerError;
};

module.exports = {
  listAll,
  listById,
  create,
  update,
  remove,
};
