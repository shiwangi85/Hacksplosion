import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginButton from './components/LoginButton';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Emergency from './pages/Emergency';
import Gamification from './pages/Gamification';
import Analytics from './pages/Analytics';
import Blockchain from './pages/Blockchain';
import Sustainability from './pages/Sustainability';

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <main className="flex-1 ml-64 min-h-screen bg-white text-gray-100">
          <div className="fixed top-0 right-0 p-4 z-50">
            <LoginButton />
          </div>
          <div className="p-8 pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/blockchain" element={<Blockchain />} />
              <Route path="/sustainability" element={<Sustainability />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App