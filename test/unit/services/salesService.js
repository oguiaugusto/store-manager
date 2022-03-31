const { expect } = require('chai');
const sinon = require('sinon');

const salesModel = require('../../../models/salesModel');
const salesService = require('../../../services/salesService');

const { errorMessages } = require('../../../schemas/salesValidations');
const httpCodes = require('../../../schemas/httpCodes');

const salesById = [
  {
    date: '2022-03-31T02:42:10.000Z',
    productId: 1,
    quantity: 5,
  },
  {
    date: '2022-03-31T02:42:10.000Z',
    productId: 2,
    quantity: 10,
  },
];

const allSales = [
  {
    saleId: 1,
    date: '2022-03-31T02:42:10.000Z',
    productId: 2,
    quantity: 20,
  },
  {
    saleId: 1,
    date: '2022-03-31T02:42:10.000Z',
    productId: 3,
    quantity: 30,
  },
  {
    saleId: 1,
    date: '2022-03-31T02:42:10.000Z',
    productId: 1,
    quantity: 10,
  },
];

const ID_TEST = 1;
const INVALID_ID_TEST = 15855;

describe('salesService.js', () => {
  describe('listAll should', () => {
    describe('when no sale is found: ', () => {
      before(async () => {
        sinon.stub(salesModel, 'listAll').resolves(null);
      });
      after(() => salesModel.listAll.restore());

      it('return an object with an error object', async () => {
        const response = await salesService.listAll();

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await salesService.listAll();

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.NOT_FOUND);
        expect(response.error.message).to.be.equal(errorMessages.noSaleFound);
      });
    });

    describe('when sales are found: ', () => {
      before(async () => {
        sinon.stub(salesModel, 'listAll').resolves(allSales);
      });
      after(() => salesModel.listAll.restore());

      it('return an array of objects with expected values', async () => {
        const response = await salesService.listAll();

        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
        expect(response).to.have.deep.members(allSales);
      });
    });
  });

  describe('listById should', () => {
    describe('when id is invalid: ', () => {
      it('return an object with an error object', async () => {
        const response = await salesService.listById(null);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await salesService.listById('INVALID_ID_TEST');

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.BAD_REQUEST);
        expect(response.error.message).to.be.equal(errorMessages.invalidId);
      });
    });

    describe('when no sale is found: ', () => {
      before(async () => {
        sinon.stub(salesModel, 'listById').resolves(null);
      });
      after(() => salesModel.listById.restore());

      it('return an object with an error object', async () => {
        const response = await salesService.listById(INVALID_ID_TEST);

        expect(response).to.be.an('object');
        expect(response).to.have.property('error');
        expect(response.error).to.be.an('object');
      });
      it('the error object must have the keys `code` and `message` with expected values', async () => {
        const response = await salesService.listById(INVALID_ID_TEST);

        expect(response.error).to.have.property('code');
        expect(response.error).to.have.property('message');
        expect(response.error.code).to.be.equal(httpCodes.NOT_FOUND);
        expect(response.error.message).to.be.equal(errorMessages.saleNotFound);
      });
    });

    describe('when the sale is found: ', () => {
      before(async () => {
        sinon.stub(salesModel, 'listById').resolves(salesById);
      });
      after(() => salesModel.listById.restore());

      it('return an array of objects', async () => {
        const response = await salesService.listById(ID_TEST);
        
        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
      });
      it('the object must have the expected values', async () => {
        const response = await salesService.listById(ID_TEST);

        expect(response).to.have.deep.members(salesById);
      });
    });
  });
});
