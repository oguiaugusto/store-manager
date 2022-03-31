const { expect } = require('chai');
const sinon = require('sinon');

const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');

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

const newSaleValues = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 5 },
];

const ID_TEST = 1;

describe('salesModel.js', () => {
  describe('listAll should', () => {
    describe('when catches an error: ', () => {
      before(async () => {
        const error = new Error('Some error thing');
        sinon.stub(connection, 'execute').rejects(error);
      });
      after(() => connection.execute.restore());

      it('return an error instance', async () => {
        const response = await salesModel.listAll();
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when no sale is found: ', () => {
      before(async () => {
        const execute = [];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return null', async () => {
        const response = await salesModel.listAll();
        expect(response).to.be.null;
      });
    });

    describe('when sales are found', () => {
      before(async () => {
        const execute = [allSales];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return an array of objects', async () => {
        const response = await salesModel.listAll();

        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
      });
      it('return an array with the expected values', async () => {
        const response = await salesModel.listAll();

        expect(response).to.have.deep.members(allSales);
      });
      it('the objects has expected keys and values', async () => {
        const response = await salesModel.listAll();

        expect(response[0]).to.have.property('saleId');
        expect(response[0]).to.have.property('date');
        expect(response[0]).to.have.property('productId');
        expect(response[0]).to.have.property('quantity');

        expect(response[0]).to.be.eql(allSales[0]);
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
        const response = await salesModel.listById(ID_TEST);
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when no sale is found', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return null', async () => {
        const response = await salesModel.listById(ID_TEST);
        expect(response).to.be.null;
      });
    });

    describe('when the sale is found', () => {
      before(async () => {
        const execute = [salesById];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return an array of objects', async () => {
        const response = await salesModel.listById(ID_TEST);

        expect(response).to.be.an('array');
        response.forEach((item) => expect(item).to.be.an('object'));
      });
      it('the array has expected values', async () => {
        const response = await salesModel.listById(ID_TEST);
        expect(response).to.have.deep.members(salesById);
      });
    });
  });

  describe('create should', () => {
    describe('when sale is not created: ', () => {
      before(async () => {
        const error = new Error('sale not created');
        sinon.stub(connection, 'execute').rejects(error);
      });
      after(() => connection.execute.restore());
  
      it('return an error instance', async () => {
        const response = await salesModel.create(newSaleValues);
        expect(response).to.be.a.instanceOf(Error);
      });
    });

    describe('when sale is created: ', () => {
      before(async () => {
        const execute = [{ insertId: ID_TEST }];
        sinon.stub(connection, 'execute').resolves(execute);
        sinon.stub(salesModel, 'insertIntoSalesProduct').resolves();
      });
      after(() => {
        connection.execute.restore();
        salesModel.insertIntoSalesProduct.restore();
      });

      it('returns an object with keys `id` and `itemsSold`', async () => {
        const response = await salesModel.create(newSaleValues);

        expect(response).to.be.an('object');
        expect(response).to.have.property('id');
        expect(response).to.have.property('itemsSold');
      });
      it('the object has expected values (including the list of items)', async () => {
        const response = await salesModel.create(newSaleValues);
        expect(response).to.be.eql({ id: ID_TEST, itemsSold: newSaleValues });
      });
    });
  });
});
