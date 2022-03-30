const productsService = require('../services/productsService');
const httpCodes = require('../schemas/httpCodes');

const listAll = async (_req, res, next) => {
  const products = await productsService.listAll();

  if (products.error) return next(products.error);
  return res.status(httpCodes.OK).json(products);
};

const listById = async (req, res, next) => {
  const product = await productsService.listById(req.params.id);

  if (product.error) return next(product.error);
  return res.status(httpCodes.OK).json(product);
};

module.exports = {
  listAll,
  listById,
};
