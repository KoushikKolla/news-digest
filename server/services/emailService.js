const axios = require('axios');

const sendDigestEmail = async (email, articles) => {
    if (!articles || articles.length === 0) {
        console.log(`No articles to send config for ${email}`);
        return;
    }

    const articlesHtml = articles.map(article => `
    <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
      <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
      <p style="font-size: 14px; color: #555;">${article.description || ''}</p>
      ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Image" style="max-width: 100%; height: auto; border-radius: 5px; margin-top: 10px;" />` : ''}
    </div>
  `).join('');

    const emailContent = `
    <h1>Your Daily News Digest</h1>
    <p>Here are the top stories for your favorite topics today:</p>
    ${articlesHtml}
    <p style="margin-top: 30px; font-size: 12px; color: #888;">You are receiving this because you subscribed to News Digest.</p>
  `;

    // Brevo API Logic
    try {
        if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY.includes('your_brevo_api_key')) {
            throw new Error('Missing Brevo Key (mocking)');
        }

        const data = {
            sender: { name: 'News Digest', email: 'koushikkolla1ga22is082@gmail.com' }, // User verified sender in Brevo
            to: [{ email: email }],
            subject: `Your Daily News Digest - ${new Date().toLocaleDateString()}`,
            htmlContent: emailContent,
        };

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
        console.log(`Email sent to ${email} via Brevo:`, response.data);
    } catch (error) {
        console.warn(`[Mock Email Service]: Could not send real email to ${email}. logging content below.`);
        console.log('--- EMAIL CONTENT START ---');
        console.log(`To: ${email}`);
        console.log(`Subject: Your Daily News Digest`);
        console.log(`Headlines: ${articles.map(a => a.title).join(', ')}`);
        console.log('--- EMAIL CONTENT END ---');
    }
};

module.exports = { sendDigestEmail };
