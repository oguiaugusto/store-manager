const { expect } = require('chai');
const sinon = require('sinon');

const productsModel = require('../../../models/productsModel');
const productsService = require('../../../services/productsService');

const { errorMessages } = require('../../../schemas/productsValidations');
const httpCodes = require('../../../schemas/httpCodes');

const singleProduct = {
  id: 1,
  name: 'Product1',
  quantity: 1,
};

const arrayOfProducts = [
  { id: 1, name: 'Product1', quantity: 1 },
  { id: 2, name: 'Product2', quantity: 2 },
  { id: 3, name: 'Product3', quantity: 3 },
];

const newProductValues = {
  name: 'Product1',
  quantity: 1,
};

const productToUpdate = {
  id: 1,
  name: 'Updated Product',
  quantity: 4,
};

const ID_TEST = 1;
const INVALID_ID_TEST = 15855;

describe('productsService.js', () => {
  describe('listAll should', () => {
    describe('when an error is returned: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listAll').resolves(error);
      });
      after(() => productsModel.listAll.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.listAll();

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.listAll();

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when no product is found: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listAll').resolves(null);
      });
      after(() => productsModel.listAll.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.listAll();

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.listAll();

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.NOT_FOUND);
        expect(response.error.message).to.be.equal(errorMessages.noProductFound);
      });
    });

    describe('when products are found: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listAll').resolves(arrayOfProducts);
      });
      after(() => productsModel.listAll.restore());

      it('return an array of objects with expected values', async () => {
        const response = await productsService.listAll();

        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
        expect(response).to.have.deep.members(arrayOfProducts);
      });
      it('the array must be sorted by object ids ascending', async () => {
        const response = await productsService.listAll();

        const responseIds = response.map((r) => r.id);
        const ascendingIds = [1, 2, 3];
        expect(responseIds).to.have.deep.members(ascendingIds);
      });
    });
  });

  describe('listById should', () => {
    describe('when an error is returned: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listById').resolves(error);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.listById(ID_TEST);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.listById(ID_TEST);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when id is invalid: ', () => {
      it('return an object with an error object', async () => {
        const response = await productsService.listById(null);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.listById('INVALID_ID_TEST');

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.BAD_REQUEST);
        expect(response.error.message).to.be.equal(errorMessages.invalidId);
      });
    });

    describe('when no product is found: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(null);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.listById(INVALID_ID_TEST);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.listById(INVALID_ID_TEST);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.NOT_FOUND);
        expect(response.error.message).to.be.equal(errorMessages.productNotFound);
      });
    });

    describe('when the product is found: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(singleProduct);
      });
      after(() => productsModel.listById.restore());

      it('return an object', async () => {
        const response = await productsService.listById(ID_TEST);
        expect(response).to.be.an('object');
      });
      it('the object must have the expected values', async () => {
        const response = await productsService.listById(ID_TEST);

        expect(response).to.be.eql(singleProduct);
      });
    });
  });

  describe('create should', () => {
    describe('when an error is returned: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'findByName').resolves(null);
        sinon.stub(productsModel, 'create').resolves(error);
      });
      after(() => {
        productsModel.findByName.restore();
        productsModel.create.restore();
      });

      it('return an object with an error object', async () => {
        const response = await productsService.create(singleProduct.name);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.create(singleProduct.name);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when an error is returned on seeking for existing product', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'findByName').resolves(error);
      });
      after(() => productsModel.findByName.restore());

      it('return an object with an error object with expected', async () => {
        const response = await productsService.create(singleProduct.name);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.create(singleProduct.name);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when product already exists: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'findByName').resolves(singleProduct);
      });
      after(() => productsModel.findByName.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.create(newProductValues);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
    });

    describe('when product is created: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'findByName').resolves(null);
        sinon.stub(productsModel, 'create').resolves(singleProduct);
      });
      after(() => {
        productsModel.findByName.restore();
        productsModel.create.restore();
      });

      it('returns an object', async () => {
        const response = await productsService.create(newProductValues);
        expect(response).to.be.an('object');
      });
      it('the object must have the expected values', async () => {
        const response = await productsService.create(newProductValues);
        expect(response).to.be.eql(singleProduct);
      });
    });
  });

  describe('update should', () => {
    describe('when an error is returned: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listById').resolves(singleProduct);
        sinon.stub(productsModel, 'update').resolves(error);
      });
      after(() => {
        productsModel.listById.restore()
        productsModel.update.restore()
      });

      it('return an object with an error object', async () => {
        const response = await productsService.update(productToUpdate);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.update(productToUpdate);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when an error is returned on seeking for existing product', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listById').resolves(error);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object with expected', async () => {
        const response = await productsService.update(productToUpdate);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.update(productToUpdate);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when product does not exist: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(null);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.update(productToUpdate);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
    });

    describe('when product is updated: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(singleProduct);
        sinon.stub(productsModel, 'update').resolves(productToUpdate);
      });
      after(() => {
        productsModel.listById.restore();
        productsModel.update.restore();
      });

      it('returns an object', async () => {
        const response = await productsService.update(productToUpdate);
        expect(response).to.be.an('object');
      });
      it('the object must have the expected values', async () => {
        const response = await productsService.update(productToUpdate);
        expect(response).to.be.eql(productToUpdate);
      });
    });
  });

  describe('remove should', () => {
    describe('when an error is returned: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listById').resolves(singleProduct);
        sinon.stub(productsModel, 'remove').resolves(error);
      });
      after(() => {
        productsModel.listById.restore()
        productsModel.remove.restore()
      });

      it('return an object with an error object', async () => {
        const response = await productsService.remove(singleProduct.id);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.remove(singleProduct.id);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when an error is returned on seeking for existing product', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(productsModel, 'listById').resolves(error);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object with expected', async () => {
        const response = await productsService.remove(productToUpdate);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await productsService.remove(productToUpdate);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.INTERNAL_SERVER_ERROR);
        expect(response.error.message).to.be.equal(errorMessages.internalServerError);
      });
    });

    describe('when product does not exist: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(null);
      });
      after(() => productsModel.listById.restore());

      it('return an object with an error object', async () => {
        const response = await productsService.remove(singleProduct.id);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
    });

    describe('when product is removed: ', () => {
      before(async () => {
        sinon.stub(productsModel, 'listById').resolves(singleProduct);
        sinon.stub(productsModel, 'remove').resolves();
      });
      after(() => {
        productsModel.listById.restore();
        productsModel.remove.restore();
      });

      it('does not return anything', async () => {
        const response = await productsService.remove(singleProduct.id);
        expect(response).to.be.undefined;
      });
    });
  });
});
