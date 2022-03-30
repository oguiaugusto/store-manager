const connection = require('./connection');

const listAll = async () => {
  const [sales] = await connection.execute(
    'SELECT * FROM StoreManager.sales ORDER BY id',
  );
  
  if (!sales || sales.length === 0) return null;
  return sales;
};

const listById = async (id) => {
  const [sale] = await connection.execute(
    'SELECT * FROM StoreManager.sales WHERE id = ?',
    [id],
  );

  if (!sale || sale.length === 0) return null;
  return sale[0];
};

module.exports = {
  listAll,
  listById,
};
