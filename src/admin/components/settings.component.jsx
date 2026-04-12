import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';
import {
    Box,
    H2,
    H4,
    Text,
    Label,
    Input,
    Button,
    MessageBox,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@adminjs/design-system';

const api = new ApiClient();

const Settings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchSettings = () => {
        setLoading(true);
        api.getPage({ pageName: 'Settings' })
            .then((response) => {
                setSettings(response.data.settings || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Settings fetch error:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleEdit = (setting) => {
        setEditingId(setting.id);
        setEditValues({ ...editValues, [setting.id]: setting.value });
        setMessage(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setMessage(null);
    };

    const handleValueChange = (id, value) => {
        setEditValues({ ...editValues, [id]: value });
    };

    const handleSave = async (setting) => {
        setSaving(setting.id);
        setMessage(null);
        try {
            const response = await api.getPage({
                pageName: 'Settings',
                data: {
                    action: 'update',
                    id: setting.id,
                    value: editValues[setting.id],
                },
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: `"${setting.key}" updated successfully!` });
                setEditingId(null);
                fetchSettings();
            } else {
                setMessage({ type: 'error', text: response.data.error || 'Failed to update setting.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update setting.' });
        }
        setSaving(null);
    };

    if (loading) {
        return (
            <Box flex justifyContent="center" alignItems="center" style={{ minHeight: 400 }}>
                <Text fontSize="lg" color="grey60">Loading settings...</Text>
            </Box>
        );
    }

    return (
        <Box p="xxl" style={{ background: '#F8FAFC', minHeight: '100vh' }}>
            {/* Header */}
            <Box mb="xxl">
                <H2 style={{ color: '#1E293B', marginBottom: 4 }}>Settings</H2>
                <Text color="grey60" fontSize="md">
                    View and manage application configuration
                </Text>
            </Box>

            {/* Message */}
            {message && (
                <Box mb="xl">
                    <MessageBox
                        variant={message.type === 'success' ? 'success' : 'danger'}
                        message={message.text}
                        onCloseClick={() => setMessage(null)}
                    />
                </Box>
            )}

            {/* Settings Table */}
            <Box
                bg="white"
                p="xl"
                style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
                <Box style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                                <th style={thStyle}>Key</th>
                                <th style={thStyle}>Value</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Last Updated</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {settings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#94A3B8' }}>
                                        No settings found
                                    </td>
                                </tr>
                            ) : (
                                settings.map((setting) => (
                                    <tr key={setting.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={tdStyle}>
                                            <Box
                                                px="sm"
                                                py="xs"
                                                style={{
                                                    background: '#EEF2FF',
                                                    borderRadius: 6,
                                                    display: 'inline-block',
                                                    fontFamily: 'monospace',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: '#4338CA',
                                                }}
                                            >
                                                {setting.key}
                                            </Box>
                                        </td>
                                        <td style={tdStyle}>
                                            {editingId === setting.id ? (
                                                <Input
                                                    value={editValues[setting.id] || ''}
                                                    onChange={(e) => handleValueChange(setting.id, e.target.value)}
                                                    style={{ minWidth: 200 }}
                                                />
                                            ) : (
                                                <Text style={{ fontWeight: 500, color: '#1E293B' }}>
                                                    {setting.value}
                                                </Text>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <Text color="grey60" fontSize="sm">
                                                {setting.description || '—'}
                                            </Text>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text color="grey60" fontSize="sm">
                                                {setting.updatedAt
                                                    ? new Date(setting.updatedAt).toLocaleString()
                                                    : '—'}
                                            </Text>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            {editingId === setting.id ? (
                                                <Box flex justifyContent="center">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleSave(setting)}
                                                        disabled={saving === setting.id}
                                                        mr="sm"
                                                    >
                                                        {saving === setting.id ? 'Saving...' : 'Save'}
                                                    </Button>
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() => handleEdit(setting)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
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
    verticalAlign: 'middle',
};

export default Settings;
