const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const donenv = require("dotenv");
donenv.config();

const UserController = require("../controllers/UserController");
//const authenticateToken = require("../middleware/authMiddleware");
 

// router.get('/report1/:id', InvoiceController.report1);
// router.post('/report1/:id', InvoiceController.report1);

router.get('/getLevelByToken', UserController.getLevelByToken );
router.post('/create',UserController.create);
router.get('/list',  UserController.list);
router.put('/update',UserController.update);
router.delete('/remove/:id',  UserController.remove);
router.post('/signIn', UserController.signIn);

module.exports = router;
