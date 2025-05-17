// File: routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

// Konfigurasi upload foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "admin_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rute API
router.get("/admin/profile", adminController.getAdminProfile);
router.put("/admin/profile/update", adminController.updateAdminProfile);
router.put("/admin/profile/upload-foto", upload.single("foto"), adminController.uploadAdminPhoto);

module.exports = router;
