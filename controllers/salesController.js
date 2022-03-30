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

module.exports = {
  listAll,
  listById,
};
