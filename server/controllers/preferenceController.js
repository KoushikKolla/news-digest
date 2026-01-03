const User = require('../models/User');
const { fetchNewsForTopics } = require('../services/newsService');
const { sendDigestEmail } = require('../services/emailService');

// @desc    Get user profile/preferences
// @route   GET /api/preferences
// @access  Private
exports.getPreferences = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            email: user.email,
            topics: user.topics,
            isSubscribed: user.isSubscribed,
            createdAt: user.createdAt,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update topics
// @route   PUT /api/preferences/topics
// @access  Private
exports.updateTopics = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.topics = req.body.topics || user.topics;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            topics: updatedUser.topics,
            isSubscribed: updatedUser.isSubscribed,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle subscription
// @route   PUT /api/preferences/subscribe
// @access  Private
exports.toggleSubscription = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.isSubscribed = req.body.isSubscribed; // Expect boolean
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            topics: updatedUser.topics,
            isSubscribed: updatedUser.isSubscribed,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Trigger manual digest
// @route   POST /api/preferences/manual-digest
// @access  Private
exports.triggerManualDigest = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const articles = await fetchNewsForTopics(user.topics);
        if (articles.length > 0) {
            await sendDigestEmail(user.email, articles);
            res.json({ message: 'Digest sent successfully' });
        } else {
            res.status(404).json({ message: 'No news found for your topics' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending digest' });
    }
};

// @desc    Get news for user topics (Preview)
// @route   GET /api/preferences/news
// @access  Private
exports.getNews = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const articles = await fetchNewsForTopics(user.topics, page);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news' });
    }
};
