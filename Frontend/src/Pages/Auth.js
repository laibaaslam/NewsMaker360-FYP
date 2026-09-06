import React, { useState } from 'react';
import Login from './LogIn.js';
import SignUp from './SignUp.js';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login'); // 'login' or 'signup'

  const switchToLogin = () => {
    setCurrentForm('login');
  };

  const switchToSignUp = () => {
    setCurrentForm('signup');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        {currentForm === 'login' ? (
          <Login />
        ) : (
          <SignUp />
        )}

        <p className="mt-4">
          {currentForm === 'login' ? (
            <>
              Don't have an account?{' '}
              <span className="text-blue-500 cursor-pointer" onClick={switchToSignUp}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="text-blue-500 cursor-pointer" onClick={switchToLogin}>
                Log In
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
