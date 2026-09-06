import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CanvasJSReact from '@canvasjs/react-charts';
import { useAuth } from '../Store/auth.js';
import { Link } from 'react-router-dom';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const COLORS = ['#001E35', '#004170', '#2F6FA8', '#5B8DB8', '#7EB8E0', '#0F766E', '#334155', '#475569'];

const formatDayLabel = (date) =>
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export const AdminDashboard = () => {
    const { authorizationToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const [usersRes, activitiesRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/admin/users', {
                        headers: { Authorization: authorizationToken },
                    }),
                    axios.get('http://localhost:8080/api/admin/activities', {
                        headers: { Authorization: authorizationToken },
                    }),
                ]);
                setUsers(usersRes.data.users || []);
                setActivities(activitiesRes.data.activities || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [authorizationToken]);

    const chartData = useMemo(() => {
        const byUserMap = {};
        activities.forEach((a) => {
            const key = a.username || 'Unknown';
            byUserMap[key] = (byUserMap[key] || 0) + 1;
        });

        const byUserPoints = Object.entries(byUserMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([label, y], i) => ({
                label,
                y,
                color: COLORS[i % COLORS.length],
            }));

        const piePoints = Object.entries(byUserMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([label, y], i) => ({
                label,
                y,
                color: COLORS[i % COLORS.length],
            }));

        // Last 14 days of activity volume
        const days = [];
        const dayCounts = {};
        for (let i = 13; i >= 0; i -= 1) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            days.push(key);
            dayCounts[key] = 0;
        }

        activities.forEach((a) => {
            const key = new Date(a.reportDate).toISOString().slice(0, 10);
            if (key in dayCounts) {
                dayCounts[key] += 1;
            }
        });

        const timelinePoints = days.map((key) => ({
            label: formatDayLabel(new Date(`${key}T00:00:00`)),
            y: dayCounts[key],
        }));

        return { byUserPoints, piePoints, timelinePoints };
    }, [activities]);

    const adminCount = users.filter((u) => u.role).length;
    const uniqueActiveUsers = new Set(activities.map((a) => a.userId).filter(Boolean)).size;

    const timelineOptions = {
        animationEnabled: true,
        theme: 'light2',
        backgroundColor: 'transparent',
        axisX: {
            title: 'Date',
            labelFontColor: '#5b6f82',
            lineColor: '#d4e0ea',
            tickColor: '#d4e0ea',
            labelFontSize: 11,
            interval: 1,
            labelAngle: -35,
        },
        axisY: {
            title: 'Reports generated',
            includeZero: true,
            labelFontColor: '#5b6f82',
            gridColor: '#e8f1f8',
            lineColor: '#d4e0ea',
        },
        toolTip: {
            shared: true,
            content: '{label}: <strong>{y}</strong> activities',
        },
        data: [
            {
                type: 'splineArea',
                color: '#004170',
                fillOpacity: 0.25,
                markerSize: 7,
                dataPoints: chartData.timelinePoints,
            },
        ],
    };

    const byUserOptions = {
        animationEnabled: true,
        theme: 'light2',
        backgroundColor: 'transparent',
        axisX: {
            labelFontColor: '#5b6f82',
            lineColor: '#d4e0ea',
            tickColor: '#d4e0ea',
            interval: 1,
            labelFontSize: 12,
        },
        axisY: {
            title: 'Activities',
            includeZero: true,
            labelFontColor: '#5b6f82',
            gridColor: '#e8f1f8',
        },
        data: [
            {
                type: 'column',
                indexLabel: '{y}',
                indexLabelFontColor: '#001E35',
                indexLabelPlacement: 'outside',
                dataPoints: chartData.byUserPoints,
            },
        ],
    };

    const pieOptions = {
        animationEnabled: true,
        backgroundColor: 'transparent',
        theme: 'light2',
        legend: {
            verticalAlign: 'bottom',
            horizontalAlign: 'center',
            fontSize: 12,
            fontColor: '#5b6f82',
        },
        data: [
            {
                type: 'doughnut',
                showInLegend: true,
                indexLabel: '{label}: {y}',
                indexLabelFontSize: 12,
                indexLabelFontColor: '#001E35',
                toolTipContent: '<strong>{label}</strong>: {y} activities',
                dataPoints: chartData.piePoints.length
                    ? chartData.piePoints
                    : [{ label: 'No data', y: 1, color: '#d4e0ea' }],
            },
        ],
    };

    if (loading) {
        return <div className="admin-loading">Loading analytics...</div>;
    }

    if (error) {
        return <div className="admin-error">{error}</div>;
    }

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
                    <span>Total activities</span>
                    <strong>{activities.length}</strong>
                </div>
                <div className="admin-stat-card">
                    <span>Active users</span>
                    <strong>{uniqueActiveUsers}</strong>
                </div>
            </div>

            <div className="admin-chart-grid">
                <div className="admin-panel admin-chart-card admin-chart-card--wide">
                    <div className="admin-panel-header">
                        <h2>Activities over last 14 days</h2>
                        <Link to="/admin/activities" className="admin-btn admin-btn--edit">
                            View all
                        </Link>
                    </div>
                    <div className="admin-chart-body">
                        {activities.length === 0 ? (
                            <div className="admin-empty">No activity data yet. Generate a report to see trends.</div>
                        ) : (
                            <CanvasJSChart options={timelineOptions} />
                        )}
                    </div>
                </div>

                <div className="admin-panel admin-chart-card">
                    <div className="admin-panel-header">
                        <h2>Activities by user</h2>
                    </div>
                    <div className="admin-chart-body">
                        {chartData.byUserPoints.length === 0 ? (
                            <div className="admin-empty">No user activity yet.</div>
                        ) : (
                            <CanvasJSChart options={byUserOptions} />
                        )}
                    </div>
                </div>

                <div className="admin-panel admin-chart-card">
                    <div className="admin-panel-header">
                        <h2>Activity share</h2>
                    </div>
                    <div className="admin-chart-body">
                        {chartData.piePoints.length === 0 ? (
                            <div className="admin-empty">No share data yet.</div>
                        ) : (
                            <CanvasJSChart options={pieOptions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
