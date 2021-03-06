const connection = require('./connection');

const listAll = async () => {
  try {
    const [products] = await connection.execute(
      'SELECT * FROM StoreManager.products ORDER BY id;',
    );
    
    if (!products || products.length === 0) return null;
    return products;
  } catch (error) {
    return error;
  }
};

const listById = async (id) => {
  try {
    const [product] = await connection.execute(
      'SELECT * FROM StoreManager.products WHERE id = ?;',
      [id],
    );
  
    if (!product || product.length === 0) return null;
    return product[0];
  } catch (error) {
    return error;
  }
};

const findByName = async (name) => {
  try {
    const [product] = await connection.execute(
      'SELECT * FROM StoreManager.products WHERE name = ?',
      [name],
    );

    if (!product || product.length === 0) return null;
    return product[0];
  } catch (error) {
    return error;
  }
};

const create = async ({ name, quantity }) => {
  try {
    const [{ insertId: id }] = await connection.execute(
      'INSERT INTO StoreManager.products(name, quantity) VALUES(?, ?);',
      [name, quantity],
    );

    return { id, name, quantity };
  } catch (error) {
    return error;
  }
};

const update = async ({ id, name, quantity }) => {
  try {
    const query = name
      ? 'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?;'
      : 'UPDATE StoreManager.products SET quantity = ? WHERE id = ?';
    const parameters = name ? [name, quantity, id] : [quantity, id];

    await connection.execute(query, parameters);
    return { id, name, quantity };
  } catch (error) {
    return error;
  }
};

const remove = async (id) => {
  try {
    await connection.execute(
      'DELETE FROM StoreManager.products WHERE id = ?;',
      [id],
    );
  } catch (error) {
    return error;
  }
};

module.exports = {
  listAll,
  listById,
  findByName,
  create,
  update,
  remove,
};
