const cron = require('node-cron');
const User = require('./models/User');
const { fetchNewsForTopics } = require('./services/newsService');
const { sendDigestEmail } = require('./services/emailService');

const runDigest = async () => {
    console.log('Running scheduled digest task...');
    try {
        // Find users who are subscribed and have topics
        const users = await User.find({ isSubscribed: true, topics: { $ne: [] } });

        console.log(`Found ${users.length} subscribed users.`);

        for (const user of users) {
            console.log(`Processing digest for ${user.email}...`);
            const articles = await fetchNewsForTopics(user.topics);

            if (articles.length > 0) {
                await sendDigestEmail(user.email, articles);

                user.lastEmailSent = new Date();
                await user.save();
            } else {
                console.log(`No news found for ${user.email} topics: ${user.topics}`);
            }
        }
        console.log('Digest task completed.');
    } catch (error) {
        console.error('Error in digest task:', error);
    }
};

// Schedule: 
// Development: Every 5 minutes -> '*/5 * * * *'
// Production: Daily at 12 PM (Vercel Hobby Limit) -> '0 12 * * *'

const schedule = process.env.NODE_ENV === 'production' ? '0 12 * * *' : '*/5 * * * *';

const startCron = () => {
    console.log(`Starting Cron Job with schedule: ${schedule}`);
    cron.schedule(schedule, runDigest);
};

// Also export runDigest for manual triggering
module.exports = { startCron, runDigest };
