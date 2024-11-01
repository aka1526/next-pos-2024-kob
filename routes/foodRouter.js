const express = require("express");
const router = express.Router();
const donenv = require("dotenv");
donenv.config();
//const authMiddleware  = require("../middleware/authMiddleware");
const FoodController = require("../controllers/FoodController");

// router.get('/report1/:id', InvoiceController.report1);
 
router.post('/paginate',FoodController.paginate);
router.get('/filter/:foodType',  FoodController.filter);
router.get('/search/:foodType',  FoodController.search);

router.put('/update', FoodController.update);
router.delete('/remove/:id',  FoodController.remove);
router.get('/list',  FoodController.list);
router.post('/upload',  FoodController.upload);
router.post('/create', FoodController.create);

module.exports = router;
