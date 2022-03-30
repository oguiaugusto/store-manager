const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.get('/', productsController.listAll);
router.get('/:id', productsController.listById);

module.exports = router;
