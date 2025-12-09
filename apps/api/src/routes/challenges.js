const express = require('express');
const router = express.Router();
const {
  getDailyChallenge,
  startChallenge,
  submitChallenge,
  getChallengeHistory,
  getChallengeStreak,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/daily', getDailyChallenge);
router.post('/start', startChallenge);
router.post('/:id/submit', submitChallenge);
router.get('/history', getChallengeHistory);
router.get('/streak', getChallengeStreak);

module.exports = router;


