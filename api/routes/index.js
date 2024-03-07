const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const smartphonesController = require('../controllers/smartphonesController');
const { authenticateUser } = require('../middlewares')

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/smartphones', authenticateUser, smartphonesController.getAll);
router.get('/smartphones/:id', authenticateUser, smartphonesController.getById);
router.post('/smartphones', authenticateUser, smartphonesController.create);
router.put('/smartphones/:id', authenticateUser, smartphonesController.update);
router.delete('/smartphones/:id', authenticateUser, smartphonesController.delete);

module.exports = router;
