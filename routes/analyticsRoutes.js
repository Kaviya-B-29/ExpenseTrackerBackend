const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/analyticsController");

router.get("/", auth, ctrl.getAnalytics);

module.exports = router;
