import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import LocationForm from './components/LocationForm';
import PartsForm from './components/PartsForm';
import LocationsList from './components/LocationsList';
import PartsList from './components/PartsList';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <div className="content-container">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/locations" element={<LocationsList />} />
                        <Route path="/parts" element={<PartsList />} />
                        <Route path="/add-location" element={<LocationForm />} />
                        <Route path="/add-part" element={<PartsForm />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
