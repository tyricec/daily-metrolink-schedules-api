const express = require('express');
var dbQuery = require('../utils/dbQuery');

const router = express.Router();

const routes = async (req, res) => {
  const routes = await dbQuery.getRoutes();
  res.json(routes);
};

const schedules = async (req, res) => {
  const schedules = await dbQuery.getSchedules(req.params.route_id);
  res.json(schedules);
};

router.use('/routes', routes);
router.use('/schedules/:route_id', schedules);

module.exports = router;
