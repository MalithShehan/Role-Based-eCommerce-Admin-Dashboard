import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';
import {
    Box,
    H2,
    H4,
    H5,
    Text,
    Illustration,
    MessageBox,
} from '@adminjs/design-system';

const api = new ApiClient();

const statusColors = {
    pending: '#F6AD55',
    processing: '#63B3ED',
    shipped: '#9F7AEA',
    delivered: '#68D391',
    cancelled: '#FC8181',
};

const Card = ({ title, value, color, icon }) => (
    <Box
        flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="white"
        p="xl"
        mr="lg"
        mb="lg"
        style={{
            borderRadius: 12,
            minWidth: 200,
            flex: '1 1 200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${color || '#3B82F6'}`,
        }}
    >
        <Text fontSize="sm" color="grey60" mb="sm" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {title}
        </Text>
        <H2 style={{ color: color || '#1E293B', margin: 0 }}>{value}</H2>
    </Box>
);

const StatusBadge = ({ status }) => (
    <Box
        px="md"
        py="xs"
        style={{
            borderRadius: 20,
            backgroundColor: statusColors[status] || '#A0AEC0',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            display: 'inline-block',
            textTransform: 'capitalize',
        }}
    >
        {status}
    </Box>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboard()
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Dashboard error:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box flex justifyContent="center" alignItems="center" style={{ minHeight: 400 }}>
                <Text fontSize="lg" color="grey60">Loading dashboard...</Text>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box p="xxl">
                <MessageBox variant="danger" message="Failed to load dashboard data." />
            </Box>
        );
    }

    // ADMIN DASHBOARD
    if (data.role === 'admin') {
        return (
            <Box p="xxl" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
                {/* Header */}
                <Box mb="xxl">
                    <H2 style={{ color: '#1E293B', marginBottom: 4 }}>{data.message}</H2>
                    <Text color="grey60" fontSize="md">Here is your store overview</Text>
                </Box>

                {/* Stats Cards */}
                <Box flex flexWrap="wrap" mb="xxl">
                    <Card title="Total Users" value={data.stats.totalUsers} color="#3B82F6" />
                    <Card title="Total Products" value={data.stats.totalProducts} color="#8B5CF6" />
                    <Card title="Total Categories" value={data.stats.totalCategories} color="#06B6D4" />
                    <Card title="Total Orders" value={data.stats.totalOrders} color="#F59E0B" />
                    <Card title="Total Revenue" value={`$${data.stats.totalRevenue}`} color="#10B981" />
                </Box>

                {/* Orders by Status */}
                <Box
                    bg="white"
                    p="xl"
                    mb="xxl"
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                    <H4 style={{ marginBottom: 16, color: '#1E293B' }}>Orders by Status</H4>
                    <Box flex flexWrap="wrap">
                        {data.ordersByStatus && data.ordersByStatus.map((item) => (
                            <Box
                                key={item.status}
                                flex
                                flexDirection="column"
                                alignItems="center"
                                p="lg"
                                mr="lg"
                                mb="sm"
                                style={{
                                    borderRadius: 8,
                                    background: '#F8FAFC',
                                    minWidth: 120,
                                }}
                            >
                                <StatusBadge status={item.status} />
                                <H4 style={{ margin: '8px 0 0', color: '#1E293B' }}>{item.count}</H4>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Recent Orders Table */}
                <Box
                    bg="white"
                    p="xl"
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                    <H4 style={{ marginBottom: 16, color: '#1E293B' }}>Recent Orders</H4>
                    <Box style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                                    <th style={thStyle}>Order ID</th>
                                    <th style={thStyle}>Customer</th>
                                    <th style={thStyle}>Amount</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders && data.recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={tdStyle}>#{order.id}</td>
                                        <td style={tdStyle}>{order.userName}</td>
                                        <td style={tdStyle}>${order.totalAmount}</td>
                                        <td style={tdStyle}><StatusBadge status={order.status} /></td>
                                        <td style={tdStyle}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </Box>
        );
    }

    // REGULAR USER DASHBOARD
    return (
        <Box p="xxl" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
            {/* Header */}
            <Box mb="xxl">
                <H2 style={{ color: '#1E293B', marginBottom: 4 }}>{data.message}</H2>
                <Text color="grey60" fontSize="md">Here is your account summary</Text>
            </Box>

            {/* Personal Info */}
            {data.personalInfo && (
                <Box
                    bg="white"
                    p="xl"
                    mb="xxl"
                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                    <H4 style={{ marginBottom: 16, color: '#1E293B' }}>Personal Information</H4>
                    <Box flex flexWrap="wrap">
                        <Box mr="xxl" mb="md">
                            <Text fontSize="sm" color="grey60" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Name</Text>
                            <Text style={{ fontWeight: 600, fontSize: 16, color: '#1E293B' }}>{data.personalInfo.name}</Text>
                        </Box>
                        <Box mr="xxl" mb="md">
                            <Text fontSize="sm" color="grey60" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Email</Text>
                            <Text style={{ fontWeight: 600, fontSize: 16, color: '#1E293B' }}>{data.personalInfo.email}</Text>
                        </Box>
                        <Box mr="xxl" mb="md">
                            <Text fontSize="sm" color="grey60" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Role</Text>
                            <Box
                                px="md"
                                py="xs"
                                style={{
                                    borderRadius: 20,
                                    backgroundColor: '#EEF2FF',
                                    color: '#4338CA',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: 'inline-block',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {data.personalInfo.role}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Stats Cards */}
            <Box flex flexWrap="wrap" mb="xxl">
                <Card title="Your Orders" value={data.stats.totalOrders} color="#3B82F6" />
                <Card title="Total Spent" value={`$${data.stats.totalSpent}`} color="#10B981" />
            </Box>

            {/* Recent Orders */}
            <Box
                bg="white"
                p="xl"
                style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
                <H4 style={{ marginBottom: 16, color: '#1E293B' }}>Your Recent Orders</H4>
                <Box style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                                <th style={thStyle}>Order ID</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentOrders && data.recentOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={tdStyle}>#{order.id}</td>
                                    <td style={tdStyle}>${order.totalAmount}</td>
                                    <td style={tdStyle}><StatusBadge status={order.status} /></td>
                                    <td style={tdStyle}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
};

const thStyle = {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const tdStyle = {
    padding: '12px 16px',
    fontSize: 14,
    color: '#334155',
};

export default Dashboard;
