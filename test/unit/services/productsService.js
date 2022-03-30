const { expect } = require('chai');
const sinon = require('sinon');

const productsModel = require('../../../models/productsModel');
const productsService = require('../../../services/productsService');

const { errorMessages } = require('../../../schemas/productsValidations');
const errorCodes = require('../../../schemas/errorCodes');

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

const ID_TEST = 1;
const INVALID_ID_TEST = 15855;

describe('productsService.js', () => {
  describe('listAll should', () => {
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
        expect(response.error.code).to.be.equal(errorCodes.NOT_FOUND);
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
        expect(response.error.code).to.be.equal(errorCodes.BAD_REQUEST);
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
        expect(response.error.code).to.be.equal(errorCodes.NOT_FOUND);
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
});
