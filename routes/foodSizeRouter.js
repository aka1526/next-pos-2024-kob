const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const FoodSizeController = require("../controllers/FoodSizeController");

 
// router.get('/report1/:id', InvoiceController.report1);

router.put('/update',  FoodSizeController.update);
router.delete('/remove/:id', FoodSizeController.remove);
router.get('/list',FoodSizeController.list);
router.post('/create', FoodSizeController.create);
module.exports = router;
