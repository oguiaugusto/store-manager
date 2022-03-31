const { expect } = require('chai');
const sinon = require('sinon');

const productsService = require('../../../services/productsService');
const productsController = require('../../../controllers/productsController');
const { errorObjects, errorMessages } = require('../../../schemas/productsValidations');
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

const newProductValues = {
  name: 'Product1',
  quantity: 1,
};

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
        const jsonObj = { message: errorMessages.noProductFound };

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
        const jsonObj = { message: errorMessages.invalidId };

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
        const jsonObj = { message: errorMessages.productNotFound };

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

  describe('create should', () => {
    describe('when product already exists: ', () => {
      const request = { body: newProductValues };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'create').resolves(errorObjects.productAlreadyExists);
      });
      after(() => productsService.create.restore());

      it('return status `409 - Conflict` and json with message: `Product already exists`', async () => {
        await productsController.create(request, response, next);

        expect(response.status.calledWith(httpCodes.CONFLICT)).to.be.true;
        expect(response.json.calledWith({ message: errorMessages.productAlreadyExists })).to.be.true;
      });
    });
    
    describe('when product is created: ', () => {
      const request = { body: newProductValues };
      const response = {};

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'create').resolves(singleProduct);
      });
      after(() => productsService.create.restore());

      it('return status `201 - Created`', async () => {
        await productsController.create(request, response);
        expect(response.status.calledWith(httpCodes.CREATED)).to.be.true;
      });
      it('return json with expected product', async () => {
        await productsController.create(request, response);
        expect(response.json.calledWith(singleProduct)).to.be.true;
      });
    });
  });

  describe('update should', () => {
    describe('when product does not exist: ', () => {
      const request = { body: newProductValues, params: { id: ID_TEST } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});
  
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'update').resolves(errorObjects.productNotFound);
      });
      after(() => productsService.update.restore());

      it('return status `404 - Not Found` and json with message: `Product not found`', async () => {
        await productsController.update(request, response, next);

        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
        expect(response.json.calledWith({ message: errorMessages.productNotFound })).to.be.true;
      });
    });

    describe('when product is updated: ', () => {
      const request = { body: newProductValues, params: { id: ID_TEST } };
      const response = {};

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productsService, 'update').resolves(singleProduct);
      });
      after(() => productsService.update.restore());

      it('return status `200 - OK`', async () => {
        await productsController.update(request, response);
        expect(response.status.calledWith(httpCodes.OK)).to.be.true;
      });
      it('return json with product data updated', async () => {
        await productsController.update(request, response);
        expect(response.json.calledWith(singleProduct)).to.be.true;
      });
    });
  });

  describe('remove should', () => {
    describe('when product does not exist: ', () => {
      const request = { params: { id: ID_TEST } };
      const response = {};
      const next = (err) => errorMiddleware(err, request, response, () => {});
  
      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'remove').resolves(errorObjects.productNotFound);
      });
      after(() => productsService.remove.restore());

      it('return status `404 - Not Found` and json with message: `Product not found`', async () => {
        await productsController.remove(request, response, next);

        expect(response.status.calledWith(httpCodes.NOT_FOUND)).to.be.true;
        expect(response.json.calledWith({ message: errorMessages.productNotFound })).to.be.true;
      });
    });

    describe('when product is removed: ', () => {
      const request = { params: { id: ID_TEST } };
      const response = {};

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        response.end = sinon.stub().returns();

        sinon.stub(productsService, 'remove').resolves(singleProduct);
      });
      after(() => productsService.remove.restore());

      it('return status `204 - No Content`', async () => {
        await productsController.remove(request, response);
        expect(response.status.calledWith(httpCodes.NO_CONTENT)).to.be.true;
      });
      it('do not return any content in the body', async () => {
        await productsController.remove(request, response);
        expect(response.end.calledTwice).to.be.true;
      });
    });
  });
});
