import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
  VpnKey as KeyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AddAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password || !confirmPassword || !secretCode) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in as an admin to create new admin accounts');
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE_URL}/api/create-admin`, {
        email,
        password,
        secretCode
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess('New admin account created successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSecretCode('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 500,
          mx: 'auto',
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PersonAddIcon 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              mb: 2,
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Add New Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new administrator account
          </Typography>
        </Box>

        <Card sx={{ mb: 3, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="primary">
                Security Requirements
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              • You must be logged in as an admin to create new admin accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • The secret code is required for security verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Password must be at least 8 characters long
            </Typography>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Admin Secret Code"
            type="password"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon color="primary" />
                </InputAdornment>
              ),
            }}
            helperText="Enter the secret code (lance)"
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Admin Account'
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddAdmin; 