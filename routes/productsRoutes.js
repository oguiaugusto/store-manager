const express = require('express');
const productsController = require('../controllers/productsController');
const validations = require('../middlewares/productsValidations');

const router = express.Router();

router.get('/', productsController.listAll);
router.get('/:id', productsController.listById);

router.post('/', validations, productsController.create);
router.put('/:id', validations, productsController.update);
router.delete('/:id', productsController.remove);

module.exports = router;
