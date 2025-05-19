const express = require("express");
const router = express.Router();
const { createKasusTransaction } = require("../controllers/paymentKasusController");

router.post("/transaction-kasus", createKasusTransaction);

module.exports = router;
