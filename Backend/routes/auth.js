const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const fetchuser = require("../middleware/fetchuser");
router.post(
  "/register",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  authController.createUser
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  authController.loginUser
);
router.put("/changepassword", fetchuser, [
  body("currentPassword", "Current password is required").notEmpty(),
  body("newPassword", "New password must be at least 5 characters long").isLength({ min: 5 }),
], authController.changePassword);

router.post("/getuser", fetchuser, authController.getUser);

module.exports = router;
