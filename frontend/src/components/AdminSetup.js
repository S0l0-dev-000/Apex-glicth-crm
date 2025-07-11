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
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
  VpnKey as KeyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminSetup = () => {
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
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        email,
        password,
        secretCode
      });

      setSuccess('Admin account created successfully! Redirecting to login...');
      setTimeout(() => {
        // Refresh the page to update admin status
        window.location.href = '/login';
      }, 2000);
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a237e 0%, #0277bd 100%)',
        p: 2
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AdminIcon 
            sx={{ 
              fontSize: 60, 
              color: 'primary.main',
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(26, 35, 126, 0.3))'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1a237e, #0277bd)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Setup
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your administrator account to get started
          </Typography>
        </Box>

        <Card sx={{ mb: 3, bgcolor: 'rgba(26, 35, 126, 0.05)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="primary">
                Security Requirements
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              • A secret code is required to create admin accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Password must be at least 8 characters long
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Only one admin account can be created initially
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
            helperText="Enter the secret code provided by your system administrator"
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
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1a237e, #0277bd)',
              '&:hover': {
                background: 'linear-gradient(45deg, #000051, #004c8c)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminSetup; 