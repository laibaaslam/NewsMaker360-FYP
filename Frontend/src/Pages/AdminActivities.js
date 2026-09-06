import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Store/auth.js';

export const AdminActivities = () => {
    const { authorizationToken } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState(null);

    const getAllActivities = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('http://localhost:8080/api/admin/activities', {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (response.data?.success) {
                setActivities(response.data.activities || []);
            } else {
                setError(response.data?.message || 'Failed to load activities');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllActivities();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return activities;
        return activities.filter(
            (a) =>
                a.username?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.videoLink?.toLowerCase().includes(q) ||
                a.transcribedText?.toLowerCase().includes(q)
        );
    }, [activities, search]);

    const uniqueUsers = useMemo(
        () => new Set(activities.map((a) => a.userId).filter(Boolean)).size,
        [activities]
    );

    return (
        <div>
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span>Total activities</span>
                    <strong>{activities.length}</strong>
                </div>
                <div className="admin-stat-card">
                    <span>Unique users</span>
                    <strong>{uniqueUsers}</strong>
                </div>
                <div className="admin-stat-card">
                    <span>Showing</span>
                    <strong>{filtered.length}</strong>
                </div>
            </div>

            <div className="admin-panel">
                <div className="admin-panel-header">
                    <h2>Activity feed</h2>
                    <input
                        className="admin-search"
                        type="search"
                        placeholder="Search user, email, or video..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading && <div className="admin-loading">Loading activities...</div>}
                {error && <div className="admin-error">{error}</div>}
                {!loading && !error && filtered.length === 0 && (
                    <div className="admin-empty">No activities found.</div>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="admin-activity-list">
                        {filtered.map((activity) => {
                            const id = activity._id;
                            const isOpen = openId === id;
                            return (
                                <div key={id} className="admin-activity-card">
                                    <button
                                        type="button"
                                        className="admin-activity-summary"
                                        onClick={() => setOpenId(isOpen ? null : id)}
                                    >
                                        <div className="admin-activity-meta">
                                            <h3>
                                                {activity.username}{' '}
                                                <span style={{ fontWeight: 500, color: '#5b6f82' }}>
                                                    · {activity.email}
                                                </span>
                                            </h3>
                                            <p>
                                                {activity.videoLink?.length > 70
                                                    ? `${activity.videoLink.slice(0, 70)}...`
                                                    : activity.videoLink}
                                            </p>
                                        </div>
                                        <span className="admin-activity-date">
                                            {new Date(activity.reportDate).toLocaleString()}
                                            <span style={{ marginLeft: 8 }}>{isOpen ? '▴' : '▾'}</span>
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="admin-activity-body">
                                            <dl>
                                                <div>
                                                    <dt>Video link</dt>
                                                    <dd>
                                                        <a
                                                            href={activity.videoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {activity.videoLink}
                                                        </a>
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt>Transcribed text</dt>
                                                    <dd className="whitespace-pre-wrap">{activity.transcribedText}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminActivities;
