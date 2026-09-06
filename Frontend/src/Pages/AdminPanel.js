import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../Store/auth.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { authorizationToken } = useAuth();

    const getAllUsersData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                headers: {
                    Authorization: authorizationToken,
                },
            });
            setUsers(response.data.users || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsersData();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return;
        try {
            const response = await axios.delete(`http://localhost:8080/api/admin/users/delete/${id}`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });
            if (response.data.success) {
                toast.success(response.data.message || 'User deleted');
                getAllUsersData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.username?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.contact?.toLowerCase().includes(q)
        );
    }, [users, search]);

    const adminCount = users.filter((u) => u.role).length;

    return (
        <div>
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span>Total users</span>
                    <strong>{users.length}</strong>
                </div>
                <div className="admin-stat-card">
                    <span>Admins</span>
                    <strong>{adminCount}</strong>
                </div>
                <div className="admin-stat-card">
                    <span>Regular users</span>
                    <strong>{users.length - adminCount}</strong>
                </div>
            </div>

            <div className="admin-panel">
                <div className="admin-panel-header">
                    <h2>User directory</h2>
                    <input
                        className="admin-search"
                        type="search"
                        placeholder="Search by name, email, contact..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading && <div className="admin-loading">Loading users...</div>}

                {!loading && filteredUsers.length === 0 && (
                    <div className="admin-empty">No users match your search.</div>
                )}

                {!loading && filteredUsers.length > 0 && (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((curUser) => (
                                    <tr key={curUser._id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-avatar">
                                                    {(curUser.username || '?').slice(0, 1).toUpperCase()}
                                                </div>
                                                <span>{curUser.username}</span>
                                            </div>
                                        </td>
                                        <td>{curUser.email}</td>
                                        <td>{curUser.contact}</td>
                                        <td>
                                            <span className={`admin-role ${curUser.role ? 'admin-role--admin' : 'admin-role--user'}`}>
                                                {curUser.role ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <Link
                                                    to={`/admin/users/${curUser._id}/update-user`}
                                                    className="admin-btn admin-btn--edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="admin-btn admin-btn--danger"
                                                    onClick={() => deleteUser(curUser._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
