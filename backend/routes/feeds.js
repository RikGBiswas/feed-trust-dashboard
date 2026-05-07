const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/feedController");

// KPI summary — must be registered before the :id route
router.get("/kpis/summary", ctrl.getKpiSummary);
router.get("/options/distinct", ctrl.getDistinctOptions);

router.get("/", ctrl.getAllFeeds);
router.get("/:id", ctrl.getFeedById);
router.post("/", ctrl.createFeed);
router.put("/:id", ctrl.updateFeed);
router.delete("/:id", ctrl.deleteFeed);

module.exports = router;
