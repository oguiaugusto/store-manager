const { expect } = require('chai');
const sinon = require('sinon');

const connection = require('../../../models/connection');
const productsModel = require('../../../models/productsModel');

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

const objectToCreate = {
  name: 'Product1',
  quantity: 1,
};

const ID_TEST = 1;

describe('productsModel.js', () => {
  describe('listAll should', () => {
    describe('when catches an error: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(connection, 'execute').rejects(error);
      });
      after(() => connection.execute.restore());

      it('return an error instance', async () => {
        const response = await productsModel.listAll();
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when no product is found: ', () => {
      before(async () => {
        const execute = [];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return null', async () => {
        const response = await productsModel.listAll();
        expect(response).to.be.null;
      });
    });

    describe('when products are found: ', () => {
      before(async () => {
        const execute = [arrayOfProducts];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return an array of objects', async () => {
        const response = await productsModel.listAll();

        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
      });
      it('return an array with the expected values', async () => {
        const response = await productsModel.listAll();

        expect(response).to.have.deep.members(arrayOfProducts);
      });
      it('the objects has expected keys and values', async () => {
        const response = await productsModel.listAll();

        expect(response[0]).to.have.property('id');
        expect(response[0]).to.have.property('name');
        expect(response[0]).to.have.property('quantity');

        expect(response[0]).to.be.eql(arrayOfProducts[0]);
      });
    });
  });

  describe('listById should', () => {
    describe('when catches an error: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(connection, 'execute').rejects(error);
      });
      after(() => connection.execute.restore());

      it('return an error instance', async () => {
        const response = await productsModel.listById(ID_TEST);
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when no product is found: ', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return null', async () => {
        const response = await productsModel.listById(ID_TEST);
        expect(response).to.be.null;
      });
    });

    describe('when the product is found: ', () => {
      before(async () => {
        const execute = [[singleProduct]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return an object', async () => {
        const response = await productsModel.listById(ID_TEST);
        expect(response).to.be.an('object');
      });
      it('the object has expected keys and values', async () => {
        const response = await productsModel.listById(ID_TEST);

        expect(response).to.have.property('id');
        expect(response).to.have.property('name');
        expect(response).to.have.property('quantity');

        expect(response).to.be.eql(singleProduct)
      });
    });
  });

  describe('create should', () => {
    describe('when product is not created: ', () => {
      before(async () => {
        const error = new Error('Product not created');
        sinon.stub(connection, 'execute').rejects(error);
      });
      after(() => connection.execute.restore());

      it('return an error instance', async () => {
        const response = await productsModel.create(objectToCreate);
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when product is created: ', () => {
      before(async () => {
        const execute = [{ insertId: singleProduct.id }];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('returns an object', async () => {
        const response = await productsModel.create(objectToCreate);
        expect(response).to.be.an('object');
      });
      it('the object has expected keys and values', async () => {
        const response = await productsModel.create(objectToCreate);
        expect(response).to.be.eql(singleProduct);
      });
    });
  });
});
