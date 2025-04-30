import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardOficial from './DashboardOficial';
import DashboardRapido from './DashboardRapido';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-4xl font-bold text-center mb-10">DASHBOARD ELECTORAL</h1>
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="/oficial"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Conteo Oficial
          </a>
          <a
            href="/rapido"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Conteo Rápido
          </a>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/oficial" />} />
          <Route path="/oficial" element={<DashboardOficial />} />
          <Route path="/rapido" element={<DashboardRapido />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
