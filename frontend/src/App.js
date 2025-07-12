import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import Navbar from './components/Navbar';

// Lazy load components for better performance
const CustomerList = lazy(() => import('./components/CustomerList'));
const CustomerForm = lazy(() => import('./components/CustomerForm'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const AdminSetup = lazy(() => import('./components/AdminSetup'));
const AddAdmin = lazy(() => import('./components/AddAdmin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const Analytics = lazy(() => import('./components/Analytics'));

// Loading component
const LoadingSpinner = memo(() => (
  <Box 
    display="flex" 
    flexDirection="column" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="50vh"
    gap={2}
  >
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      Loading...
    </Typography>
  </Box>
));

function UserDashboard() {
  return <div style={{textAlign: 'center', marginTop: '4rem'}}><h2>User Dashboard</h2><p>Welcome, regular user!</p></div>;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0277bd', // Professional blue
      light: '#58a5f0',
      dark: '#004c8c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = React.useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [adminExists, setAdminExists] = React.useState(null);
  const token = localStorage.getItem('token');

  // Check if admin exists on app load
  React.useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { API_BASE_URL } = await import('./config');
        const response = await fetch(`${API_BASE_URL}/api/admin-exists`);
        const data = await response.json();
        setAdminExists(data.adminExists);
      } catch (error) {
        console.error('Error checking admin existence:', error);
        setAdminExists(false);
      }
    };
    checkAdminExists();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setAdminExists(true); // Admin exists after login
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: '#f8fafc'
        }}>
          <Navbar user={null} onLogout={handleLogout} />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/add-admin" element={<AddAdmin />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/*" element={
                  // TEMPORARILY DISABLED - Skip authentication for now
                  <Routes>
                    <Route path="/" element={<CustomerList />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/customers/:id" element={<CustomerForm />} />
                  </Routes>
                } />
              </Routes>
            </Suspense>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
