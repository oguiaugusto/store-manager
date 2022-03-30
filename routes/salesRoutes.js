const express = require('express');
const salesController = require('../controllers/salesController');

const router = express.Router();

router.get('/', salesController.listAll);
router.get('/:id', salesController.listById);

module.exports = router;
