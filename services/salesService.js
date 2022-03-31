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

module.exports = {
  listAll,
  listById,
};
