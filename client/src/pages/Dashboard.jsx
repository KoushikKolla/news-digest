import { useState, useEffect } from 'react';
import { getPreferences, updateTopics, toggleSubscription, triggerManualDigest, getNews } from '../services/api';

const Dashboard = () => {
    const [preferences, setPreferences] = useState({ topics: [], isSubscribed: true });
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [newTopic, setNewTopic] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [newsLoading, setNewsLoading] = useState(false);
    const [sendingDigest, setSendingDigest] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (preferences.topics.length > 0) {
            fetchNews(page);
        }
    }, [page]);

    const fetchData = async () => {
        try {
            const prefRes = await getPreferences();
            setPreferences(prefRes.data);
            if (prefRes.data.topics.length > 0) {
                await fetchNews(1);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNews = async (pageNum) => {
        setNewsLoading(true);
        try {
            const { data } = await getNews(pageNum);
            setNews(data);
        } catch (error) {
            console.error('Error fetching news', error);
        } finally {
            setNewsLoading(false);
        }
    }

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!newTopic.trim()) return;

        if (preferences.topics.includes(newTopic.trim())) {
            setNewTopic('');
            return;
        }

        const updatedTopics = [...preferences.topics, newTopic.trim()];
        try {
            const { data } = await updateTopics(updatedTopics);
            setPreferences(data);
            setNewTopic('');
            setPage(1); // Reset to page 1
            fetchNews(1);
        } catch (error) {
            console.error(error);
            setMessage('Failed to add topic');
        }
    };

    const handleRemoveTopic = async (topicToRemove) => {
        const updatedTopics = preferences.topics.filter(t => t !== topicToRemove);
        try {
            const { data } = await updateTopics(updatedTopics);
            setPreferences(data);
            if (updatedTopics.length > 0) {
                setPage(1);
                fetchNews(1);
            } else {
                setNews([]);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to remove topic');
        }
    };

    const handleToggleSubscription = async () => {
        try {
            const { data } = await toggleSubscription(!preferences.isSubscribed);
            setPreferences(data);
        } catch (error) {
            console.error(error);
            setMessage('Failed to toggle subscription');
        }
    };

    const handleManualDigest = async () => {
        setSendingDigest(true);
        try {
            const { data } = await triggerManualDigest();
            setMessage("✅ Success! " + data.message);
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error(error);
            setMessage("❌ " + (error.response?.data?.message || 'Failed to send digest'));
        } finally {
            setSendingDigest(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPage(newPage);
        document.querySelector('#news-feed')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Your Dashboard</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage your topics and subscriptions.</p>
            </div>

            {message && <div className={`p-4 rounded-xl mb-8 font-medium shadow-sm transition-all ${message.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{message}</div>}

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Content - Topics & News */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Topics Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Favorite Topics</h2>

                        <form onSubmit={handleAddTopic} className="flex gap-3 mb-8">
                            <input
                                type="text"
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                placeholder="e.g. Artificial Intelligence, NBA, startups"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                            />
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                                Add
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-3">
                            {preferences.topics.length === 0 && (
                                <div className="text-slate-400 italic w-full text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No topics added yet. Add one above to get started!
                                </div>
                            )}
                            {preferences.topics.map((topic, index) => (
                                <div key={index} className="group bg-slate-50 border border-slate-200 px-4 py-2 rounded-full flex items-center gap-3 hover:bg-white hover:shadow-md transition-all">
                                    <span className="font-medium text-slate-700">{topic}</span>
                                    <button
                                        onClick={() => handleRemoveTopic(topic)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        aria-label="Remove topic"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News Feed Section */}
                    <div id="news-feed" className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Latest News</h2>
                            <span className="text-slate-400 text-sm">Page {page}</span>
                        </div>

                        {newsLoading ? (
                            <div className="py-12 flex justify-center">
                                <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                            </div>
                        ) : news.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">
                                {preferences.topics.length === 0 ? "Add topics above to see news." : "No more news found."}
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {news.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                        {item.urlToImage && (
                                            <img src={item.urlToImage} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded-xl bg-slate-100" />
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-2">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                                                    {item.title}
                                                </a>
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2 mb-2">{item.description}</p>
                                            <span className="text-xs text-slate-400">Source: NewsAPI</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {preferences.topics.length > 0 && (
                            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1 || newsLoading}
                                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={news.length < 5 || newsLoading}
                                    className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-md"
                                >
                                    Next Page
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Settings */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Subscription</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600">Daily Digest</span>
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${preferences.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {preferences.isSubscribed ? 'ACTIVE' : 'PAUSED'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">
                            {preferences.isSubscribed
                                ? 'We will send you a digest every 12 hours.'
                                : 'You are currently not receiving any emails.'}
                        </p>
                        <button
                            onClick={handleToggleSubscription}
                            className={`w-full py-2.5 rounded-xl font-medium transition-colors border ${preferences.isSubscribed ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'}`}
                        >
                            {preferences.isSubscribed ? 'Pause Subscription' : 'Resume Subscription'}
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-lg shadow-indigo-200 p-6 text-white">
                        <h3 className="text-lg font-bold mb-2">Test It Now</h3>
                        <p className="text-indigo-100 text-sm mb-6 opacity-90">
                            Want to see what your digest looks like right now? Trigger a manual delivery.
                        </p>
                        <button
                            onClick={handleManualDigest}
                            disabled={!preferences.isSubscribed || preferences.topics.length === 0 || sendingDigest}
                            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sendingDigest ? 'Sending...' : 'Send Digest Email'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
