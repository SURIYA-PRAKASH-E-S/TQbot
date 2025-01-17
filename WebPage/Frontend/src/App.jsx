import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/admin/adminLogin';
import AdminSignUp from './pages/admin/adminSignup';
import AdminDashboard from './pages/admin/adminDashboard';
import Footer from './components/Footer';
import Schedule from './pages/BookingPage';



function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: Choose a theme
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/bookings" element={<Schedule />} />

          <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
      {/* <ChatBot /> */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;
