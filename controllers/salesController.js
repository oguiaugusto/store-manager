const salesService = require('../services/salesService');
const httpCodes = require('../schemas/httpCodes');

const listAll = async (_req, res, next) => {
  const sales = await salesService.listAll();

  if (sales.error) return next(sales.error);
  return res.status(httpCodes.OK).json(sales);
};

const listById = async (req, res, next) => {
  const sale = await salesService.listById(req.params.id);

  if (sale.error) return next(sale.error);
  return res.status(httpCodes.OK).json(sale);
};

const create = async (req, res, next) => {
  const sale = await salesService.create(req.body);

  if (sale.error) return next(sale.error);
  return res.status(httpCodes.CREATED).json(sale);
};

const update = async (req, res, next) => {
  const { params: { id }, body } = req;
  
  const sale = await salesService.update(id, body);
  if (sale.error) return next(sale.error);

  return res.status(httpCodes.OK).json(sale);
};

const remove = async (req, res, next) => {
  const sale = await salesService.remove(req.params.id);

  if (sale && sale.error) return next(sale.error);
  return res.status(httpCodes.NO_CONTENT).end();
};

module.exports = {
  listAll,
  listById,
  create,
  update,
  remove,
};
