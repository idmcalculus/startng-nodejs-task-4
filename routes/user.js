const express = require('express');
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', UserController.userSignup);
router.post('/login', UserController.userLogin);
router.get('/admin', auth, UserController.becomeAdmin);

module.exports = router;