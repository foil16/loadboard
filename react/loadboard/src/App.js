// App.js
import './App.css';
import Home from './pages/Home';
import Truckers from './pages/Truckers';
import {Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/truckers/:truckId" element={<Truckers />} />
      </Routes>
  );
}

export default App;
