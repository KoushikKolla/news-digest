import { useState, useEffect } from 'react';
import { getPreferences, toggleSubscription } from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getPreferences();
                setUser(data);
            } catch (error) {
                console.error('Error loading profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleToggleSubscription = async () => {
        if (!user) return;
        try {
            const { data } = await toggleSubscription(!user.isSubscribed);
            setUser(prev => ({ ...prev, isSubscribed: data.isSubscribed }));
        } catch (error) {
            console.error("Error toggling subscription", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <div className="text-center mt-20">User not found</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-10">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                    <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30 mb-4">
                        {user.email[0].toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold">{user.email}</h1>
                    <p className="opacity-80 text-sm mt-1">
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">Subscription Status</h3>
                            <button
                                onClick={handleToggleSubscription}
                                className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors border ${user.isSubscribed ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                {user.isSubscribed ? 'Pause Subscription' : 'Resume Subscription'}
                            </button>
                        </div>

                        <div className={`inline-flex items-center px-4 py-2 rounded-xl border ${user.isSubscribed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            <span className={`h-3 w-3 rounded-full mr-2 ${user.isSubscribed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-bold">{user.isSubscribed ? 'Active Subscription' : 'Subscription Paused'}</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-2">
                            {user.isSubscribed
                                ? 'You are currently receiving daily news digests.'
                                : 'You are not receiving any emails.'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-3">Your Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.topics.length > 0 ? user.topics.map((topic, index) => (
                                <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                                    {topic}
                                </span>
                            )) : (
                                <span className="text-slate-400 italic">No topics selected yet.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
