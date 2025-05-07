const express = require("express");
const router = express.Router();
const { createTransaction } = require("../controllers/paymentController");

router.post("/transaction", createTransaction);

module.exports = router;