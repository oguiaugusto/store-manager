const { expect } = require('chai');
const sinon = require('sinon');

const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');
const { errorObjects } = require('../../../schemas/salesValidations');
const httpCodes = require('../../../schemas/httpCodes');
const errorMiddleware = require('../../../middlewares/errorMiddleware');

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
const INVALID_ID_TEST = 'INVALID';
const NOT_FOUND_ID = 15855;

describe('salesService.js', () => {
  describe('listAll should', () => {
    describe('when no sale is found: ', () => {
      const request = {};
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'listAll').resolves(errorObjects.noSaleFound);
      });
      after(() => salesService.listAll.restore());

      it('return status `404` - Not Found', async () => {
        await salesController.listAll(request, response, next);
        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
      });
      it('return json with message: `Sale not found', async () => {
        await salesController.listAll(request, response, next);
        const jsonObj = { message: errorObjects.noSaleFound.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when sales are found: ', () => {
      const request = {};
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'listAll').resolves(allSales);
      });
      after(() => salesService.listAll.restore());

      it('return status `200` - OK', async () => {
        await salesController.listAll(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with an array of sales (objects)', async () => {
        await salesController.listAll(request, response, next);
        expect(response.json.calledWith(allSales)).to.be.true;
      });
    });
  });

  describe('listById should', () => {
    describe('when id is invalid: ', () => {
      const request = { params: { id: INVALID_ID_TEST } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'listById').resolves(errorObjects.invalidId);
      });
      after(() => salesService.listById.restore());

      it('return status `400` - Bad Request', async () => {
        await salesController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.BAD_REQUEST)).to.be.true;
      });
      it('return json with message: `"id" must be a number!`', async () => {
        await salesController.listById(request, response, next);
        const jsonObj = { message: errorObjects.invalidId.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when no sale is found: ', () => {
      const request = { params: { id: NOT_FOUND_ID } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'listById').resolves(errorObjects.saleNotFound);
      });
      after(() => salesService.listById.restore());

      it('return status `404` - Not Found', async () => {
        await salesController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
      });
      it('return json with message: `Sale not found`', async () => {
        await salesController.listById(request, response, next);
        const jsonObj = { message: errorObjects.saleNotFound.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when the sale is found: ', () => {
      const request = { params: { id: ID_TEST } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'listById').resolves(salesById);
      });
      after(() => salesService.listById.restore());

      it('return status `200` - OK', async () => {
        await salesController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with an array of sales (objects)', async () => {
        await salesController.listById(request, response, next);
        expect(response.json.calledWith(salesById)).to.be.true;
      });
    });
  });
});
