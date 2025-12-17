const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/dashboardController");

router.get("/", auth, ctrl.getDashboard);

module.exports = router;
