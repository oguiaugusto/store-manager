const express = require('express');
const salesController = require('../controllers/salesController');
const validations = require('../middlewares/salesValidations');

const router = express.Router();

router.get('/', salesController.listAll);
router.get('/:id', salesController.listById);

router.post('/', validations, salesController.create);
router.put('/:id', validations, salesController.update);

module.exports = router;
