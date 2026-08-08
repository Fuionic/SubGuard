// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import LandingPage from './components/Landing/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  //const isLoggedIn = !!localStorage.getItem('userId'); // simple check

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />      {/* default page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} /> 
      </Routes>
    </Router>
  );
}

export default App;
