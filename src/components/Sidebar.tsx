import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PartsIcon, LocationIcon, AddPartIcon, AddLocationIcon } from './Icons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.container}>
      {/* Header Toggle Button */}
      <button onClick={toggleSidebar} className={styles.sidebarButton}>
        Parts Manager
      </button>

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}
      >
        <div className="flex flex-col h-full w-full p-0 m-0">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto w-full">
            <ul className="py-1">
              {/* Parts List */}
              <li>
                <Link
                  to="/parts"
                  className={styles.sidebarLink}
                  onClick={() => setIsCollapsed(true)}
                >
                  <PartsIcon className={styles.sidebarIcon} />
                  Parts List
                </Link>
              </li>

              {/* Add Part */}
              <li>
                <Link
                  to="/add-part"
                  className={styles.sidebarLink}
                  onClick={() => setIsCollapsed(true)}
                >
                  <AddPartIcon className={styles.sidebarIcon} />
                  Add Part
                </Link>
              </li>

              {/* Locations List */}
              <li>
                <Link
                  to="/locations"
                  className={styles.sidebarLink}
                  onClick={() => setIsCollapsed(true)}
                >
                  <LocationIcon className={styles.sidebarIcon} />
                  Locations List
                </Link>
              </li>

              {/* Add Location */}
              <li>
                <Link
                  to="/add-location"
                  className={styles.sidebarLink}
                  onClick={() => setIsCollapsed(true)}
                >
                  <AddLocationIcon className={styles.sidebarIcon} />
                  Add Location
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
