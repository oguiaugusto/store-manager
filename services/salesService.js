const salesModel = require('../models/salesModel');
const { errorObjects } = require('../schemas/salesValidations');
const validations = require('../schemas/genericValidations');

const listAll = async () => {
  const sales = await salesModel.listAll();

  if (sales instanceof Error) return errorObjects.internalServerError;
  if (validations.isNull(sales)) return errorObjects.noSaleFound;

  return sales;
};

const listById = async (id) => {
  if (!validations.isANumber(id) || validations.isNull(id)) return errorObjects.invalidId;

  const sale = await salesModel.listById(id);

  if (sale instanceof Error) return errorObjects.internalServerError;
  if (validations.isNull(sale)) return errorObjects.saleNotFound;

  return sale;
};

const create = async (products) => {
  const sale = await salesModel.create(products);

  if (sale instanceof Error) return errorObjects.internalServerError;

  return sale;
};

const update = async (saleId, products) => {
  const existingSale = await salesModel.listById(saleId);

  if (existingSale instanceof Error) return errorObjects.internalServerError;
  if (!existingSale) return errorObjects.saleNotFound;
  
  const sale = await salesModel.update(saleId, products);
  if (sale instanceof Error) return errorObjects.internalServerError;

  return sale;
};

module.exports = {
  listAll,
  listById,
  create,
  update,
};
