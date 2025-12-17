const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getBudget,
  setBudget,
} = require("../controllers/userController");

router.get("/budget", auth, getBudget);
router.post("/budget", auth, setBudget);

module.exports = router;
