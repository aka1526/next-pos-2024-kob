const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const BillSaleController = require("../controllers/BillSaleController");

 
// router.get('/report1/:id', InvoiceController.report1);
  
router.post('/list', BillSaleController.list);
router.delete('/remove/:id',BillSaleController.remove);

module.exports = router;
