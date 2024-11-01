const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const donenv = require("dotenv");
donenv.config();

const InvoiceController = require("../controllers/InvoiceController");
 
router.get('/report1/:id', InvoiceController.report1);
router.post('/report1', InvoiceController.report1);

module.exports = router;
