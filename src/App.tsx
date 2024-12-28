import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import LocationForm from './components/LocationForm';
import PartsForm from './components/PartsForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/locations" element={<LocationForm />} />
              <Route path="/parts" element={<PartsForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
