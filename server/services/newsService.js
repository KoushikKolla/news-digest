
const axios = require('axios');

const fetchNewsForTopics = async (topics, page = 1) => {
    if (!topics || topics.length === 0) return [];

    // Debug: Check if key exists
    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY.includes('your_news_api_key')) {
        console.warn('WARNING: NewsAPI Key is missing or default. Using mock data.');
        return getMockNews(topics, page);
    }

    try {
        const query = topics.map(t => `"${t}"`).join(' OR ');

        // Fetch last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const fromDate = yesterday.toISOString().split('T')[0];

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=popularity&pageSize=5&page=${page}&language=en&apiKey=${process.env.NEWS_API_KEY}`;

        const response = await axios.get(url);

        if (response.data.status === 'ok') {
            return response.data.articles;
        } else {
            console.error('NewsAPI Error:', response.data);
            return getMockNews(topics);
        }
    } catch (error) {
        console.error('Error fetching news (switching to mock data):', error.response ? error.response.status : error.message);
        return getMockNews(topics);
    }
};

const getMockNews = (topics, page = 1) => {
    // Return different "mock" data for page 2 to demonstrate pagination
    if (page > 1) {
        return [
            {
                title: `Page ${page}: More News on ${topics[0]}`,
                description: `This is content from page ${page}.`,
                url: '#',
                urlToImage: 'https://placehold.co/600x400?text=Page+' + page,
            },
            {
                title: `Older Story`,
                description: 'Deep dive into yesterday\'s events.',
                url: '#',
                urlToImage: 'https://placehold.co/600x400?text=Older',
            }
        ];
    }
    return [
        {
            title: `Breaking News in ${topics[0]}`,
            description: `This is a sample article description about ${topics[0]} to demonstrate the application layout.`,
            url: '#',
            urlToImage: 'https://placehold.co/600x400?text=News+Digest',
        },
        {
            title: `Latest Updates on ${topics[topics.length - 1] || 'World'}`,
            description: 'Another sample article showing how the digest will look when fully connected.',
            url: '#',
            urlToImage: 'https://placehold.co/600x400?text=Update',
        },
        {
            title: 'Global Trends Report',
            description: 'A generic mock article to ensure your dashboard always has content to display.',
            url: '#',
            urlToImage: 'https://placehold.co/600x400?text=Trends',
        }
    ];
};

module.exports = { fetchNewsForTopics };
