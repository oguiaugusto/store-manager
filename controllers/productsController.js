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

const create = async (req, res, next) => {
  const { name, quantity } = req.body;

  const product = await productsService.create({ name, quantity });
  if (product.error) return next(product.error);

  return res.status(httpCodes.CREATED).json(product);
};

const update = async (req, res, next) => {
  const { params: { id }, body: { name, quantity } } = req;

  const product = await productsService.update({ id, name, quantity });
  if (product.error) return next(product.error);

  return res.status(httpCodes.OK).json(product);
};

module.exports = {
  listAll,
  listById,
  create,
  update,
};
