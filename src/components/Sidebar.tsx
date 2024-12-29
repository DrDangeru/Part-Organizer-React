import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded"
                onClick={toggleSidebar}
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isCollapsed ? (
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    ) : (
                        <path d="M6 18L18 6M6 6l12 12" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="w-full h-full flex flex-col">
                    {/* Logo/Title */}
                    <div className="p-4 border-b border-blue-500">
                        <h1 className="text-lg font-bold">Parts Manager</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-2">
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/" 
                                    className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => setIsCollapsed(true)}
                                >
                                    <svg 
                                        className="w-5 h-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/locations" 
                                    className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => setIsCollapsed(true)}
                                >
                                    <svg 
                                        className="w-5 h-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Locations
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/add-location" 
                                    className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => setIsCollapsed(true)}
                                >
                                    <svg 
                                        className="w-5 h-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Location
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/parts" 
                                    className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => setIsCollapsed(true)}
                                >
                                    <svg 
                                        className="w-5 h-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Parts
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/add-part" 
                                    className="flex items-center p-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    onClick={() => setIsCollapsed(true)}
                                >
                                    <svg 
                                        className="w-5 h-5 mr-2" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Part
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
