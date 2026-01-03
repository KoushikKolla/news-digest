const express = require('express');
const router = express.Router();
const {
    getPreferences,
    updateTopics,
    toggleSubscription,
    triggerManualDigest,
    getNews,
} = require('../controllers/preferenceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPreferences);
router.route('/topics').put(protect, updateTopics);
router.route('/subscribe').put(protect, toggleSubscription);
router.route('/manual-digest').post(protect, triggerManualDigest);
router.route('/news').get(protect, getNews);

module.exports = router;
