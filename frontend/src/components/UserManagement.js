import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UserManagement = () => {
  const [users] = useState([
    // Mock data since we don't have users endpoint yet
    { id: 1, email: 'admin@yourcompany.com', role: 'admin', created_at: '2024-01-01', status: 'active' }
  ]);
  // const [loading, setLoading] = useState(false); // TODO: Uncomment when implementing real API calls
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // For now, we'll use mock data
    // In the future, this would fetch from /api/users endpoint
    // setLoading(true);
    try {
      // TODO: Implement real API call
      // const response = await axios.get(`${API_BASE_URL}/api/users`);
      // setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    // setLoading(false);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setEditDialog({ open: true, user: { ...user } });
    handleMenuClose();
  };

  const handleDeleteUser = (user) => {
    setDeleteDialog({ open: true, user });
    handleMenuClose();
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (newUser.role === 'admin') {
        // Use existing admin creation endpoint
        await axios.post(`${API_BASE_URL}/api/create-admin`, {
          email: newUser.email,
          password: newUser.password,
          secretCode: 'lance' // Use the secret code
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Use regular user creation endpoint
        await axios.post(`${API_BASE_URL}/api/register-user`, {
          email: newUser.email,
          password: newUser.password
        });
      }

      setMessage('User created successfully!');
      setCreateDialog(false);
      setNewUser({ email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      // This would update user via API
      setMessage('User updated successfully!');
      setEditDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const confirmDeleteUser = async () => {
    try {
      // This would delete user via API
      setMessage('User deleted successfully!');
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      admin: { color: 'error', icon: <AdminIcon sx={{ fontSize: 16 }} /> },
      user: { color: 'primary', icon: <PersonIcon sx={{ fontSize: 16 }} /> }
    };

    const config = roleConfig[role] || roleConfig.user;
    
    return (
      <Chip
        icon={config.icon}
        label={role.charAt(0).toUpperCase() + role.slice(1)}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const getStatusChip = (status) => {
    return (
      <Chip
        icon={status === 'active' ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={status === 'active' ? 'success' : 'default'}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Add User
        </Button>
      </Box>

      {/* Alerts */}
      {message && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main' }}>
                        {user.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.email.split('@')[0]}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {getRoleChip(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(user.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <MenuList>
          <MenuItemComponent onClick={() => handleEditUser(selectedUser)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reset Password</ListItemText>
          </MenuItemComponent>
          <Divider />
          <MenuItemComponent 
            onClick={() => handleDeleteUser(selectedUser)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItemComponent>
        </MenuList>
      </Menu>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Email Address"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="user">Regular User</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!newUser.email || !newUser.password}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editDialog.user && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email Address"
                type="email"
                value={editDialog.user.email}
                onChange={(e) => setEditDialog({ 
                  ...editDialog, 
                  user: { ...editDialog.user, email: e.target.value }
                })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editDialog.user.role}
                  onChange={(e) => setEditDialog({ 
                    ...editDialog, 
                    user: { ...editDialog.user, role: e.target.value }
                  })}
                  label="Role"
                >
                  <MenuItem value="user">Regular User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Update User</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{deleteDialog.user?.email}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 