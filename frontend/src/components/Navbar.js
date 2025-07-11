import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';

const Navbar = ({ user, onLogout }) => {
  const [openPassword, setOpenPassword] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');

  const handlePasswordChange = async () => {
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
              const res = await fetch('https://backend-stere8xpq-solos-projects-3bdcd80e.vercel.app/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      setMessage('Password updated successfully!');
      setCurrentPassword(''); setNewPassword('');
    } catch (e) { setError(e.message); }
  };

  const handleEmailChange = async () => {
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
              const res = await fetch('https://backend-stere8xpq-solos-projects-3bdcd80e.vercel.app/api/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change email');
      setMessage('Email updated successfully!');
    } catch (e) { setError(e.message); }
  };

  const handleCreateAdmin = async () => {
    setAdminMessage(''); setAdminError('');
    try {
      const token = localStorage.getItem('token');
              const res = await fetch('https://backend-stere8xpq-solos-projects-3bdcd80e.vercel.app/api/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword, secretCode: adminSecretCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin');
      setAdminMessage('Admin created successfully!');
      setNewAdminEmail(''); setNewAdminPassword(''); setAdminSecretCode('');
    } catch (e) { setAdminError(e.message); }
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0277bd 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
              }}
            >
              THE KING OF CAPITAL
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Capital & Customer Relationship Management
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/customers"
            startIcon={<PeopleIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Customers
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/customers/new"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Add Customer
          </Button>
          {user ? (
            <>
              <Typography sx={{ color: 'white', mx: 2, fontWeight: 500 }}>
                {user.email}
              </Typography>
              <Button color="inherit" onClick={() => setOpenEmail(true)} sx={{ borderRadius: 2, px: 3, py: 1 }}>
                Change Email
              </Button>
              <Button color="inherit" onClick={() => setOpenPassword(true)} sx={{ borderRadius: 2, px: 3, py: 1 }}>
                Change Password
              </Button>
              {user && user.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/add-admin" sx={{ borderRadius: 2, px: 3, py: 1 }}>
                  Add Admin
                </Button>
              )}
              <Button color="inherit" onClick={onLogout} sx={{ borderRadius: 2, px: 3, py: 1 }}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login" sx={{ borderRadius: 2, px: 3, py: 1 }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      {/* Change Password Dialog */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPassword(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change</Button>
        </DialogActions>
      </Dialog>
      {/* Change Email Dialog */}
      <Dialog open={openEmail} onClose={() => setOpenEmail(false)}>
        <DialogTitle>Change Email</DialogTitle>
        <DialogContent>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="New Email"
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmail(false)}>Cancel</Button>
          <Button onClick={handleEmailChange} variant="contained">Change</Button>
        </DialogActions>
      </Dialog>
      {/* Create Admin Dialog */}
      <Dialog open={openCreateAdmin} onClose={() => setOpenCreateAdmin(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          {adminMessage && <Alert severity="success">{adminMessage}</Alert>}
          {adminError && <Alert severity="error">{adminError}</Alert>}
          <TextField
            label="Admin Email"
            type="email"
            value={newAdminEmail}
            onChange={e => setNewAdminEmail(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />
          <TextField
            label="Admin Password"
            type="password"
            value={newAdminPassword}
            onChange={e => setNewAdminPassword(e.target.value)}
            fullWidth sx={{ mb: 2 }}
          />
          <TextField
            label="Admin Secret Code"
            type="password"
            value={adminSecretCode}
            onChange={e => setAdminSecretCode(e.target.value)}
            fullWidth
            helperText="Enter the admin secret code"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateAdmin(false)}>Cancel</Button>
          <Button onClick={handleCreateAdmin} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar; 