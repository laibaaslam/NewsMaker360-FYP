import Header from '../../Components/Header.js';
import Footer from '../../Components/Footer.js';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { FaUser, FaHome, FaHistory, FaChartBar } from 'react-icons/fa/index.js';
import { IoPersonAdd } from 'react-icons/io5/index.js';
import { useAuth } from '../../Store/auth.js';
import './admin.css';

const pageTitles = {
    '/admin/dashboard': {
        title: 'Dashboard',
        subtitle: 'Overview of users and past activities',
    },
    '/admin/users': {
        title: 'Users',
        subtitle: 'Manage registered accounts and permissions',
    },
    '/admin/add-user': {
        title: 'Add User',
        subtitle: 'Create a new NewsMaker360 account',
    },
    '/admin/activities': {
        title: 'Activities',
        subtitle: 'Review all generated reports across users',
    },
};

const AdminLayout = () => {
    const { User, isLoading, isLoggedIn } = useAuth();
    const location = useLocation();

    const matchedTitle =
        Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] ||
        (location.pathname.includes('update-user')
            ? { title: 'Update User', subtitle: 'Edit account details' }
            : { title: 'Admin Console', subtitle: 'NewsMaker360 administration' });

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    if (isLoading) {
        return (
            <div className="admin-shell flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="admin-spinner" />
                    <p className="text-sm text-[#5b6f82]">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!User.role) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <div className="admin-shell">
                <Header />
                <div className="admin-body">
                    <aside className="admin-sidebar">
                        <div className="admin-sidebar-brand">
                            <h2>Admin Console</h2>
                            <p>Signed in as {User.username}</p>
                        </div>

                        <nav className="admin-nav">
                            <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                                <FaChartBar /> Dashboard
                            </NavLink>
                            <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                                <FaUser /> Users
                            </NavLink>
                            <NavLink to="/admin/add-user" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                                <IoPersonAdd /> Add User
                            </NavLink>
                            <NavLink to="/admin/activities" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                                <FaHistory /> Activities
                            </NavLink>
                        </nav>

                        <div className="admin-nav-footer">
                            <NavLink to="/" className="admin-nav-link">
                                <FaHome /> Back to Home
                            </NavLink>
                        </div>
                    </aside>

                    <main className="admin-main">
                        <div className="admin-topbar">
                            <div>
                                <h1>{matchedTitle.title}</h1>
                                <p>{matchedTitle.subtitle}</p>
                            </div>
                            <span className="admin-badge">Administrator</span>
                        </div>
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminLayout;
