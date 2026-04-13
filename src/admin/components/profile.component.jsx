import React, { useState, useEffect } from 'react';
import { ApiClient, useCurrentAdmin } from 'adminjs';
import {
    Box,
    H2,
    H4,
    Text,
    Label,
    Input,
    Button,
    MessageBox,
    Icon,
} from '@adminjs/design-system';

const api = new ApiClient();

const Profile = () => {
    const [currentAdmin] = useCurrentAdmin();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const fetchProfile = () => {
        setLoading(true);
        api.getPage({ pageName: 'MyProfile' })
            .then((response) => {
                const u = response.data.user;
                setUser(u);
                if (u) {
                    setName(u.name || '');
                    setEmail(u.email || '');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Profile fetch error:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setMessage(null);

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/admin/api/pages/MyProfile', {
                method: 'POST',
                body: new URLSearchParams({
                    action: 'update',
                    name,
                    email,
                    currentPassword,
                    newPassword,
                }),
                credentials: 'include',
            });
            const result = await response.json();
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setUser(result.user);
                setEditing(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        setMessage(null);
        try {
            const response = await fetch('/admin/api/pages/MyProfile', {
                method: 'POST',
                body: new URLSearchParams({ action: 'delete' }),
                credentials: 'include',
            });
            const result = await response.json();
            if (result.success) {
                // Redirect to login after account deletion
                window.location.href = '/admin/login';
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete account' });
        }
        setDeleting(false);
    };

    const handleCancel = () => {
        setEditing(false);
        setName(user?.name || '');
        setEmail(user?.email || '');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage(null);
    };

    if (loading) {
        return (
            <Box variant="grey" padding="xxl" textAlign="center">
                <Text>Loading profile...</Text>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box variant="grey" padding="xxl" textAlign="center">
                <Text>Unable to load profile.</Text>
            </Box>
        );
    }

    return (
        <Box variant="grey" padding="xxl">
            <Box mb="xl">
                <H2>My Profile</H2>
                <Text mt="default" color="grey60">
                    View and manage your account details
                </Text>
            </Box>

            {message && (
                <Box mb="xl">
                    <MessageBox
                        message={message.text}
                        variant={message.type === 'success' ? 'success' : 'danger'}
                        onCloseClick={() => setMessage(null)}
                    />
                </Box>
            )}

            {/* Profile Info Card */}
            <Box bg="white" p="xl" mb="xl" style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="xl">
                    <H4>Account Information</H4>
                    {!editing && (
                        <Button variant="primary" onClick={() => setEditing(true)}>
                            <Icon icon="Edit" />&nbsp;Edit Profile
                        </Button>
                    )}
                </Box>

                {!editing ? (
                    /* View Mode */
                    <Box>
                        <Box display="flex" flexDirection="row" flexWrap="wrap" style={{ gap: '24px' }}>
                            <Box flex="1" minWidth="250px">
                                <Label>Name</Label>
                                <Text mt="sm" fontSize="lg" fontWeight="bold">{user.name}</Text>
                            </Box>
                            <Box flex="1" minWidth="250px">
                                <Label>Email</Label>
                                <Text mt="sm" fontSize="lg" fontWeight="bold">{user.email}</Text>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" flexWrap="wrap" mt="xl" style={{ gap: '24px' }}>
                            <Box flex="1" minWidth="250px">
                                <Label>Role</Label>
                                <Box mt="sm">
                                    <Box
                                        as="span"
                                        style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            backgroundColor: user.role === 'admin' ? '#e8f5e9' : '#e3f2fd',
                                            color: user.role === 'admin' ? '#2e7d32' : '#1565c0',
                                        }}
                                    >
                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                    </Box>
                                </Box>
                            </Box>
                            <Box flex="1" minWidth="250px">
                                <Label>Member Since</Label>
                                <Text mt="sm" fontSize="lg" fontWeight="bold">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    /* Edit Mode */
                    <Box>
                        <Box display="flex" flexDirection="row" flexWrap="wrap" style={{ gap: '24px' }}>
                            <Box flex="1" minWidth="250px" mb="lg">
                                <Label htmlFor="name" required>Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    width="100%"
                                />
                            </Box>
                            <Box flex="1" minWidth="250px" mb="lg">
                                <Label htmlFor="email" required>Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    width="100%"
                                />
                            </Box>
                        </Box>

                        <Box mt="lg" mb="lg">
                            <H4>Change Password</H4>
                            <Text color="grey60" mt="sm" mb="lg">Leave blank to keep current password</Text>
                        </Box>

                        <Box display="flex" flexDirection="row" flexWrap="wrap" style={{ gap: '24px' }}>
                            <Box flex="1" minWidth="250px" mb="lg">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    width="100%"
                                />
                            </Box>
                            <Box flex="1" minWidth="250px" mb="lg">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    width="100%"
                                />
                            </Box>
                            <Box flex="1" minWidth="250px" mb="lg">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    width="100%"
                                />
                            </Box>
                        </Box>

                        <Box display="flex" mt="xl" style={{ gap: '12px' }}>
                            <Button variant="primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="text" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Danger Zone */}
            <Box
                bg="white"
                p="xl"
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #ffcdd2',
                }}
            >
                <H4 color="danger">Danger Zone</H4>
                <Text mt="default" mb="xl" color="grey60">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                </Text>

                {!confirmDelete ? (
                    <Button
                        variant="danger"
                        onClick={() => setConfirmDelete(true)}
                    >
                        <Icon icon="Trash2" />&nbsp;Delete My Account
                    </Button>
                ) : (
                    <Box>
                        <MessageBox
                            variant="danger"
                            message="Are you sure you want to delete your account? This action cannot be undone."
                            mb="lg"
                        />
                        <Box display="flex" style={{ gap: '12px' }}>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setConfirmDelete(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
