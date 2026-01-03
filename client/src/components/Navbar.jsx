import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    News Digest
                </Link>
                <div>
                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link to="/profile" className="text-slate-600 font-medium hidden sm:block hover:text-blue-600 transition-colors">
                                {user.email}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 shadow-md hover:shadow-lg">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
