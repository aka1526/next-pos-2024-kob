const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const OrganizationController = require("../controllers/OrganizationController");

 
// router.get('/report1/:id', InvoiceController.report1);
  
//
// organization
//
router.post('/create', OrganizationController.create);
router.get('/info', OrganizationController.info);
router.post('/upload', OrganizationController.upload);

module.exports = router;
