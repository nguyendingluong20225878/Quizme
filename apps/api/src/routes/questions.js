/**
 * Question Routes
 * Các route liên quan đến Question
 */

const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateManyQuestions,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.route('/').get(getQuestions).post(protect, createQuestion);
router.route('/update-many').post(protect, updateManyQuestions);
router
  .route('/:id')
  .get(getQuestion)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;

