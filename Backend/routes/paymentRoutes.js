const express = require("express");
const router = express.Router();
const { createTransaction } = require("../controllers/paymentController");

router.post("/payment/transaction", createTransaction);

module.exports = router;
