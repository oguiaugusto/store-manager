const { expect } = require('chai');
const sinon = require('sinon');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');
const { errorObjects } = require('../../../schemas/productsValidations');
const httpCodes = require('../../../schemas/httpCodes');
const errorMiddleware = require('../../../middlewares/errorMiddleware');

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
const INVALID_ID_TEST = 'INVALID';
const NOT_FOUND_ID = 15855;

describe('productsService.js', () => {
  describe('listAll should', () => {
    describe('when no product is found: ', () => {
      const request = {};
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'listAll').resolves(errorObjects.noProductFound);
      });
      after(() => productsService.listAll.restore());

      it('return status `404` - Not Found', async () => {
        await productsController.listAll(request, response, next);
        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
      });
      it('return json with message: `Product not found', async () => {
        await productsController.listAll(request, response, next);
        const jsonObj = { message: errorObjects.noProductFound.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when products are found: ', () => {
      const request = {};
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'listAll').resolves(arrayOfProducts);
      });
      after(() => productsService.listAll.restore());

      it('return status `200` - OK', async () => {
        await productsController.listAll(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with an array of products (objects)', async () => {
        await productsController.listAll(request, response, next);
        expect(response.json.calledWith(arrayOfProducts)).to.be.true;
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

        sinon.stub(productsService, 'listById').resolves(errorObjects.invalidId);
      });
      after(() => productsService.listById.restore());

      it('return status `400` - Bad Request', async () => {
        await productsController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.BAD_REQUEST)).to.be.true;
      });
      it('return json with message: `"id" must be a number!`', async () => {
        await productsController.listById(request, response, next);
        const jsonObj = { message: errorObjects.invalidId.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when no product is found: ', () => {
      const request = { params: { id: NOT_FOUND_ID } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'listById').resolves(errorObjects.productNotFound);
      });
      after(() => productsService.listById.restore());

      it('return status `404` - Not Found', async () => {
        await productsController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
      });
      it('return json with message: `Product not found`', async () => {
        await productsController.listById(request, response, next);
        const jsonObj = { message: errorObjects.productNotFound.error.message };

        expect(response.json.calledWith(jsonObj)).to.be.true;
      });
    });

    describe('when the product is found: ', () => {
      const request = { params: { id: ID_TEST } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'listById').resolves(singleProduct);
      });
      after(() => productsService.listById.restore());

      it('return status `200` - OK', async () => {
        await productsController.listById(request, response, next);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with found product (object)', async () => {
        await productsController.listById(request, response, next);
        expect(response.json.calledWith(singleProduct)).to.be.true;
      });
    });
  });
});
