const express = require("express");
const {
  validateSchema,
} = require("../../model/contacts/contact");
const StatsControllers = require("../../controllers/stats");
const { validation, token, ctrlWrapper } = require("../../middlewares");
const router = express.Router();

router.get("/", token, ctrlWrapper(StatsControllers.getAll));

// router.get("/:contactId", ctrlWrapper(StatsControllers.getById));

// router.get("/:contactId/admin", token,  ctrlWrapper(StatsControllers.getAdminUsers));

// router.post("/",  ctrlWrapper(StatsControllers.add));

// router.delete("/:contactId", ctrlWrapper(StatsControllers.deleteById));

// router.get("/:contactId/pdf", ctrlWrapper(StatsControllers.pdf))

// router.put(
//   "/:contactId",
//   validation(validateSchema),
//   ctrlWrapper(contacts.putById)
// );

module.exports = router;
