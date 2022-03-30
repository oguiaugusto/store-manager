const { expect } = require('chai');
const sinon = require('sinon');

const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');
const { errorObjects } = require('../../../schemas/salesValidations');
const httpCodes = require('../../../schemas/httpCodes');
const errorMiddleware = require('../../../middlewares/errorMiddleware');

const singleSale = {
  id: 1,
  date: '2022-03-28 00:00:00'
};

const arrayOfSales = [
  { id: 1, date: '2022-03-28 00:00:00' },
  { id: 2, date: '2022-03-29 00:00:00' },
  { id: 3, date: '2022-03-30 00:00:00' },
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

        sinon.stub(salesService, 'listAll').resolves(arrayOfSales);
      });
      after(() => salesService.listAll.restore());

      it('return status `200` - OK', async () => {
        await salesController.listAll(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with an array of sales (objects)', async () => {
        await salesController.listAll(request, response, next);
        expect(response.json.calledWith(arrayOfSales)).to.be.true;
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

        sinon.stub(salesService, 'listById').resolves(singleSale);
      });
      after(() => salesService.listById.restore());

      it('return status `200` - OK', async () => {
        await salesController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with found sale (object)', async () => {
        await salesController.listById(request, response, next);
        expect(response.json.calledWith(singleSale)).to.be.true;
      });
    });
  });
});
