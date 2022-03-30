const { expect } = require('chai');
const sinon = require('sinon');

const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');

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

describe('salesModel.js', () => {
  describe('listAll should', () => {
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
        const execute = [arrayOfSales];
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

        expect(response).to.have.deep.members(arrayOfSales);
      });
      it('the objects has expected keys and values', async () => {
        const response = await salesModel.listAll();

        expect(response[0]).to.have.property('id');
        expect(response[0]).to.have.property('date');

        expect(response[0]).to.be.eql(arrayOfSales[0]);
      });
    });
  });

  describe('listById should', () => {
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
        const execute = [singleSale];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => connection.execute.restore());

      it('return an object', async () => {
        const response = await salesModel.listById(ID_TEST);
        expect(response).to.be.an('object');
      });
      it('the object has expected keys and values', async () => {
        const response = await salesModel.listById(ID_TEST);

        expect(response).to.have.property('id');
        expect(response).to.have.property('date');

        expect(response).to.be.eql(singleSale)
      });
    });
  });
});
