const connection = require('./connection');

const listAll = async () => {
  const [sales] = await connection.execute(
    `
    SELECT
      s.id AS saleId,
      s.date,
      p.id AS productId,
      p.quantity
    FROM StoreManager.products AS p
    INNER JOIN StoreManager.sales_products AS sp ON sp.product_id = sale_id
    INNER JOIN StoreManager.sales AS s ON s.id = sp.sale_id
    ORDER BY saleId;
    `,
  );
  
  if (!sales || sales.length === 0) return null;
  return sales;
};

const listById = async (id) => {
  const [sale] = await connection.execute(
    `
    SELECT
      s.date,
      sp.product_id AS productId,
      sp.quantity
    FROM StoreManager.sales AS s
    INNER JOIN StoreManager.sales_products AS sp ON sp.sale_id = s.id
    WHERE sp.sale_id = ? ORDER BY sale_id;
    `,
    [id],
  );

  if (!sale || sale.length === 0) return null;
  return sale;
};

module.exports = {
  listAll,
  listById,
};
