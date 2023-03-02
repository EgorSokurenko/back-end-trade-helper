const express = require("express");
const router = express.Router();
const users = require("../../controllers/users");
const {
  registerSchema,
  subscriptionSchema,
  User,
} = require("../../model/user");
const { validation, ctrlWrapper, token, upload } = require("../../middlewares");
const path = require("path");
const fs = require("fs/promises");
// router
router.post("/signup", validation(registerSchema), ctrlWrapper(users.signup));
router.post("/login", validation(registerSchema), ctrlWrapper(users.signin));
router.get("/logout", token, ctrlWrapper(users.logout));
router.get("/current", token, ctrlWrapper(users.getCurrent));

module.exports = router;
