const express = require('express');
const router = express.Router();
const faqController = require("../controllers/faqController");

// Gunakan controller untuk tiap route
router.get("/", faqController.getAllFaq);
router.post("/", faqController.createFaq);
router.put("/:id", faqController.updateFaq);
router.delete("/:id", faqController.deleteFaq);

module.exports = router;
