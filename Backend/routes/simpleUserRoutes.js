const express = require("express");
const router = express.Router();
const userController = require("../controllers/simpleUserController");

router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);
router.post("/", userController.addUser);

module.exports = router;
