/**
 * Video Routes
 * Các route liên quan đến Video
 */

const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

router.route('/').get(getVideos).post(protect, createVideo);
router
  .route('/:id')
  .get(getVideo)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo);

module.exports = router;

