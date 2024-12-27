import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LocationForm from './components/LocationForm';
import PartsForm from './components/PartsForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<LocationForm />} />
            <Route path="/parts" element={<PartsForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
