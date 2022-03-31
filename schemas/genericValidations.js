module.exports = {
  isNull: (item) => !item,
  isANumber: (item) => !Number.isNaN(Number(item)),
  isEmpty: (item) => item.length === 0,
  isLongerThan: (item, value) => item.length > value,
  isGraterThan: (item, value) => item > value,
};
