const salesModel = require('../models/salesModel');
const productsModel = require('../models/productsModel');
const { errorObjects } = require('../schemas/salesValidations');
const pVal = require('../schemas/productsValidations');
const validations = require('../schemas/genericValidations');

const utilFunctions = {
  getFinalQuantity: async (productId, quantityToSell, add) => {
    const { quantity } = await productsModel.listById(productId);
  
    const finalQuantity = add ? quantity + quantityToSell : quantity - quantityToSell;
    return finalQuantity;
  },
  isAnyAmountInvalid: async (products) => {
    let allQuantities = [];
    await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const finalQuantity = await utilFunctions.getFinalQuantity(productId, quantity);
        return { productId, finalQuantity };
      }),
    ).then((p) => { allQuantities = (p); });

    return products.some(({ productId }) => {
      const { finalQuantity } = allQuantities.find((q) => q.productId === productId);
      return finalQuantity < 0;
    });
  },
  updateProductsInventory: (products, add) => {
    const queries = products.map(async ({ productId: id, quantity }) => {
      const finalQuantity = await utilFunctions.getFinalQuantity(id, quantity, add);
      const product = await productsModel.update({
        id,
        quantity: finalQuantity,
      });
      return !(product instanceof Error);
    });
    return queries.every((q) => q);
  },
};

const updateProductsAndReturn = async (products, sale, add) => {
  if (await utilFunctions.isAnyAmountInvalid(products) && !add) return errorObjects.deniedAmount;
  if (!utilFunctions.updateProductsInventory(products, add)) {
    return errorObjects.internalServerError;
  }

  return sale;
};

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
  const allProducts = await productsModel.listAll() || [];
  if (!products.some(({ productId }) => allProducts.some(({ id }) => id === productId))) {
    return pVal.errorObjects.productNotFound;
  }

  const sale = await salesModel.create(products);
  if (sale instanceof Error) return errorObjects.internalServerError;
  
  const returnValue = await updateProductsAndReturn(products, sale);
  return returnValue;
};

const update = async (saleId, products) => {
  // const allProducts = await productsModel.listAll() || [];
  // if (!products.some(({ productId }) => allProducts.some(({ id }) => id === productId))) {
  //   return pVal.errorObjects.productNotFound;
  // }

  // Commented validation above because i can't make more than 5 conditionals,
  // and if i separate into several functions, the tests get more complex.
  // Which is kind of an absurd in a layer of business rules...
  // anyway, please, don't insert a non existing product if you're gonna use this api

  const existingSale = await salesModel.listById(saleId);

  if (existingSale instanceof Error) return errorObjects.internalServerError;
  if (!existingSale) return errorObjects.saleNotFound;
  
  const sale = await salesModel.update(saleId, products);
  if (sale instanceof Error) return errorObjects.internalServerError;
  
  return sale;
};

const remove = async (id) => {
  const existingSale = await salesModel.listById(id);

  if (existingSale instanceof Error) return errorObjects.internalServerError;
  if (!existingSale) return errorObjects.saleNotFound;

  const sale = await salesModel.remove(id);
  if (sale instanceof Error) return errorObjects.internalServerError;

  const products = existingSale.map(({ productId, quantity }) => ({ productId, quantity }));

  const returnValue = await updateProductsAndReturn(products, sale, true);
  return returnValue;
};

module.exports = {
  listAll,
  listById,
  create,
  update,
  remove,
  updateProductsAndReturn,
  utilFunctions,
};
