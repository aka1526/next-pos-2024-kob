const express = require("express");
const router = express.Router();

const donenv = require("dotenv");
donenv.config();
//const authenticateToken = require("../middleware/authMiddleware");
const FoodTypeController = require("../controllers/FoodTypeController");
 
// router.get('/report1/:id', InvoiceController.report1);

router.put('/update',  FoodTypeController.update);
router.delete('/remove/:id',FoodTypeController.remove)
router.get('/list', FoodTypeController.list);
router.post('/create', FoodTypeController.create);

module.exports = router;
