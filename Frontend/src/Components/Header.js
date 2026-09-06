import { useState } from 'react';
import Login from '../Pages/LogIn.js';
import SignUp from '../Pages/SignUp.js';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Store/auth.js';
import './Header.css';

const Navbar = () => {
  const { User, isLoggedIn } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const openSignUp = () => setShowSignUp(true);
  const closeSignUp = () => setShowSignUp(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const switchToLoginFromSignUp = () => {
    closeSignUp();
    openLogin();
  };

  const switchToSignUpFromLogin = () => {
    closeLogin();
    openSignUp();
  };

  const avatarLetter = (User?.username || 'U').slice(0, 1).toUpperCase();

  return (
    <nav className="nm-header">
      <NavLink to="/" className="nm-logo">
        <img src="/logo.png" alt="NewsMaker360" />
      </NavLink>

      <div className="nm-nav">
        <NavLink to="/" className={({ isActive }) => `nm-link${isActive ? ' active' : ''}`} end>
          HOME
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nm-link${isActive ? ' active' : ''}`}>
          ABOUT US
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) => `nm-link${isActive ? ' active' : ''}`}
            >
              GENERATE
            </NavLink>
            {User?.role ? (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => `nm-link${isActive ? ' active' : ''}`}
              >
                ADMIN
              </NavLink>
            ) : null}

            <div className="nm-profile">
              <button
                type="button"
                className="nm-btn nm-btn--profile"
                onClick={() => setToggle((prev) => !prev)}
              >
                <span className="nm-avatar">{avatarLetter}</span>
                {User?.username}
              </button>

              {toggle && (
                <div className="nm-dropdown">
                  <div className="nm-dropdown-email">{User?.email}</div>
                  <hr className="nm-dropdown-divider" />
                  {User?.role ? (
                    <NavLink
                      to="/admin/dashboard"
                      className="nm-dropdown-link"
                      onClick={() => setToggle(false)}
                    >
                      Admin Panel
                    </NavLink>
                  ) : null}
                  <NavLink
                    to="/logout"
                    className="nm-dropdown-link nm-dropdown-link--danger"
                    onClick={() => setToggle(false)}
                  >
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button type="button" className="nm-btn nm-btn--ghost" onClick={openLogin}>
              Log in
            </button>
            <button type="button" className="nm-btn nm-btn--primary" onClick={openSignUp}>
              Sign up
            </button>
            {showSignUp && (
              <SignUp onClose={closeSignUp} onSwitchToLogin={switchToLoginFromSignUp} />
            )}
            {showLogin && (
              <Login onClose={closeLogin} onSwitchToSignUp={switchToSignUpFromLogin} />
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
