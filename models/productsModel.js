const connection = require('./connection');

const listAll = async () => {
  const [products] = await connection.execute(
    'SELECT * FROM StoreManager.products ORDER BY id',
  );
  
  if (!products || products.length === 0) return null;
  return products;
};

const listById = async (id) => {
  const [product] = await connection.execute(
    'SELECT * FROM StoreManager.products WHERE id = ?',
    [id],
  );

  if (!product || product.length === 0) return null;
  return product;
};

module.exports = {
  listAll,
  listById,
};
