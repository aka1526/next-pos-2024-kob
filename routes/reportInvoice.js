const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const donenv = require("dotenv");
donenv.config();

const InvoiceController = require("../controllers/InvoiceController");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send({ error: "not have jwt token" });

  try {
    const secret = process.env.TOKEN_SECRET;

    jwt.verify(token, secret, (err, user) => {
      if (err) return res.sendStatus(403);
      // req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// router.get('/report1/:id', InvoiceController.report1);
// router.post('/report1/:id', InvoiceController.report1);
router
  .route("/report1/:id")
  .get(InvoiceController.report1)
  .post(InvoiceController.report1);

module.exports = router;
