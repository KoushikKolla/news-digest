require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { startCron, runDigest } = require('./cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        // Start Cron Job (Only if not in test mode)
        if (process.env.NODE_ENV !== 'test') {
            startCron();
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('News Digest API is running');
});

// Vercel Cron Job Endpoint
app.get('/api/cron', async (req, res) => {
    // Optional: Add a secret key check for security if desired, but not strictly required for this demo
    try {
        await runDigest();
        res.status(200).send('Cron job executed successfully');
    } catch (error) {
        res.status(500).send('Cron job failed');
    }
});

// Routes (to be added)
const authRoutes = require('./routes/auth');
const preferenceRoutes = require('./routes/preferences');

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferenceRoutes);

// Export app for testing
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // For Vercel serverless
