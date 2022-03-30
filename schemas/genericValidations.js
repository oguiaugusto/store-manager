module.exports = {
  isNull: (item) => !item,
  isANumber: (item) => !Number.isNaN(Number(item)),
};
