const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const SaleTempController = require("../controllers/SaleTempController");

 
// router.get('/report1/:id', InvoiceController.report1);
  
router.post('/printBillAfterPay',  SaleTempController.printBillAfterPay );
router.post('/endSale',  SaleTempController.endSale );
router.post('/printBillBeforePay',   SaleTempController.printBillBeforePay );
router.delete('/removeSaleTempDetail',   SaleTempController.removeSaleTempDetail );
router.post('/createSaleTempDetail',  SaleTempController.createSaleTempDetail );
router.put('/unselectSize',   SaleTempController.unselectSize );
router.put('/selectSize',   SaleTempController.selectSize );
router.put('/unselectTaste',  SaleTempController.unselectTaste );
router.put('/selectTaste',  SaleTempController.selectTaste );
router.get('/info/:id',  SaleTempController.info );
router.post('/generateSaleTempDetail',  SaleTempController.generateSaleTempDetail );
router.put('/updateQty', SaleTempController.updateQty );
router.delete('/removeAll',  SaleTempController.removeAll );
router.delete('/remove/:id',  SaleTempController.remove );
router.get('/list',   SaleTempController.list );
router.post('/create',   SaleTempController.create );

module.exports = router;
