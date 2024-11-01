const express = require("express");
const router = express.Router();
const donenv = require("dotenv");

donenv.config();

const ReportController = require("../controllers/ReportController");
const isAuthen = require('../middleware/auth'); 
//const authMiddleware  = require("../middleware/authMiddleware");
 
// router.get('/report1/:id', InvoiceController.report1);

router.post('/sumPerMonthInYear', isAuthen,  ReportController.sumPerMonthInYear );
router.post('/sumPerDayInYearAndMonth', isAuthen,  ReportController.sumPerDayInYearAndMonth );

module.exports = router;
