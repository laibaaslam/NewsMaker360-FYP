import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
// import styles from './styles.js';
import Home from './Pages/Home.js';
import AU from './Pages/AboutUs.js';
// import Contact from './Pages/Contact.js';
// import AP from './Pages/AdminPanel.js';
// import { Fragment, useState } from 'react';
// import AuthPage from './Pages/Auth.js';
// import Gen from './Pages/Generate.js';
import UserDashboard from './Pages/UserDashboard.js';
import { Toaster } from 'react-hot-toast';
import Logout from './Pages/Logout.js';
// import Login from './Pages/LogIn.js';
// import SignUp from './Pages/SignUp.js';
import Error from './Pages/Error.js';
import Activities from './Pages/pastActivities.js';
import ResetPassword from './Pages/ResetPassword.js';
import ForgetPassword from './Pages/ForgetPassword.js';
import EmailVerification from './Pages/EmailVerification.js';
import { AdminPanel } from './Pages/AdminPanel.js';
import AdminLayout from './Components/AdminLayout/adminLayout.js';
import Stepper from './Components/Stepper.js';
import { AdminUpdate } from './Pages/AdminUpdate.js';
import { AdminAddUser } from './Pages/AdminAddUser.js';
import { AdminActivities } from './Pages/AdminActivities.js';
import { AdminDashboard } from './Pages/AdminDashboard.js';
// import('./module.js')

const App = () => {
  return (
    //  <div>
    //   <PdfButton/>
    //   {console.log("dfjkdh")}
    //  </div>
    <BrowserRouter>
      <main>
        <Toaster /> {/* Render the Toaster component */}
        <Routes>
          <Route path="/stepper" element={<Stepper />} />
          <Route path="/" element={<Home />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/about" element={<AU />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminPanel />} />
            <Route path="users/:id/update-user" element={<AdminUpdate />} />
            <Route path="add-user" element={<AdminAddUser />} />
            <Route path="activities" element={<AdminActivities />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </BrowserRouter >
  );
};

export default App;
