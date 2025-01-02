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
          className="h-5 w-5"
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
      <div
        className={`sidebar-container ${
          isCollapsed ? 'hidden' : 'block'
        } md:block fixed md:static top-0 left-0 w-64 min-h-full bg-gray-100 border-r border-gray-200 z-40`}
      >
        <div className="w-full h-full flex flex-col">
          {/* Logo/Title */}
          <div className="p-4 border-b border-gray-300">
            <h1 className="text-lg font-bold">Parts Manager</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col h-full">
            <ul className="flex flex-col h-full">
              {/* Parts List */}
              <li className="flex-1 flex">
                <Link
                  to="/parts"
                  className="flex items-center justify-start w-full p-1.5 hover:bg-blue-700 hover:text-white transition-colors text-sm"
                  onClick={() => setIsCollapsed(true)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Parts List
                </Link>
              </li>

              {/* Add Part */}
              <li className="flex-1 flex">
                <Link
                  to="/add-part"
                  className="flex items-center justify-start w-full p-1.5 hover:bg-blue-700 hover:text-white transition-colors text-sm"
                  onClick={() => setIsCollapsed(true)}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <svg
                      className="w-2 h-2 text-white bg-blue-500 rounded-full ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v8m4-4H8"
                      />
                    </svg>
                  </div>
                  Add Part
                </Link>
              </li>

              {/* Locations List */}
              <li className="flex-1 flex">
                <Link
                  to="/locations"
                  className="flex items-center justify-start w-full p-1.5 hover:bg-blue-700 hover:text-white transition-colors text-sm"
                  onClick={() => setIsCollapsed(true)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Locations List
                </Link>
              </li>

              {/* Add Location */}
              <li className="flex-1 flex">
                <Link
                  to="/add-location"
                  className="flex items-center justify-start w-full p-1.5 hover:bg-blue-700 hover:text-white transition-colors text-sm"
                  onClick={() => setIsCollapsed(true)}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <svg
                      className="w-2 h-2 text-white bg-blue-500 rounded-full ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v8m4-4H8"
                      />
                    </svg>
                  </div>
                  Add Location
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
