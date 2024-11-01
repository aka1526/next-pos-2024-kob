const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const TasteController = require("../controllers/TasteController");
// router.get('/report1/:id', InvoiceController.report1);
router.put('/update', TasteController.update);
router.delete('/remove/:id',  TasteController.remove);
router.get('/list',  TasteController.list);
router.post('/create', TasteController.create);

module.exports = router;
