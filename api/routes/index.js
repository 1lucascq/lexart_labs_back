const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const smartphonesController = require('../controllers/smartphonesController');
const { authenticateUser } = require('../middlewares')

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/smartphones', smartphonesController.getAll);
router.get('/smartphones/:id', smartphonesController.getById);
router.post('/smartphones', smartphonesController.create);
router.put('/smartphones/:id', smartphonesController.update);
// router.patch('/smartphones/:id', smartphonesController.partialUpdate);
router.delete('/smartphones/:id', smartphonesController.delete);

module.exports = router;
