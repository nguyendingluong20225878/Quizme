const express = require('express');
const router = express.Router();
const {
  getCompetencyRadar,
  getErrorByDifficulty,
  getErrorByType,
  getProgressTrend,
  getWeakTopics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/competency-radar', getCompetencyRadar);
router.get('/error-analysis/by-difficulty', getErrorByDifficulty);
router.get('/error-analysis/by-type', getErrorByType);
router.get('/progress-trend', getProgressTrend);
router.get('/weak-topics', getWeakTopics);

module.exports = router;


