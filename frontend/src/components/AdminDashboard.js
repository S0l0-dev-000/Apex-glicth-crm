import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Description as DocumentIcon,
  TrendingUp as TrendingUpIcon,
  AdminPanelSettings as AdminIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { exportCustomersToExcel } from '../utils/excelExport';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalUsers: 0,
    totalAdmins: 0,
    recentCustomers: [],
    systemHealth: 'good'
  });
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch customers
      const customersResponse = await axios.get(`${API_BASE_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // For now, we'll simulate user/admin counts since we don't have a users endpoint yet
      const customers = customersResponse.data;
      const recentCustomers = customers.slice(0, 5);
      
      setAllCustomers(customers);
      setStats({
        totalCustomers: customers.length,
        totalUsers: 1, // Will implement proper user counting later
        totalAdmins: 1,
        recentCustomers,
        systemHealth: 'good'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, color: color, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Avatar sx={{ bgcolor: color, width: 48, height: 48, mx: 'auto', mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const handleExportCompleted = async () => {
    if (allCustomers.length === 0) {
      alert('No customer data available to export.');
      return;
    }

    const result = exportCustomersToExcel(allCustomers, 'completed_applications', 'completed');
    if (result?.success) {
      alert(`Successfully exported ${result.recordCount} completed applications to ${result.filename}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Loading Dashboard...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your CRM system.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton 
            onClick={fetchDashboardData}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/admin/settings')}
            sx={{ borderRadius: 2 }}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<BusinessIcon />}
            color="primary.main"
            subtitle="Active customers in system"
            onClick={() => navigate('/customers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="secondary.main"
            subtitle="Registered users"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Administrators"
            value={stats.totalAdmins}
            icon={<AdminIcon />}
            color="warning.main"
            subtitle="Admin accounts"
            onClick={() => navigate('/add-admin')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value="Excellent"
            icon={<AssessmentIcon />}
            color="success.main"
            subtitle="All systems operational"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="Add Customer"
                  description="Create a new customer record"
                  icon={<PersonAddIcon />}
                  color="primary.main"
                  onClick={() => navigate('/customers/new')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="User Management"
                  description="Manage users and permissions"
                  icon={<PeopleIcon />}
                  color="secondary.main"
                  onClick={() => navigate('/admin/users')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="Analytics"
                  description="View business insights"
                  icon={<TrendingUpIcon />}
                  color="info.main"
                  onClick={() => navigate('/admin/analytics')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="Add Admin"
                  description="Create new administrator"
                  icon={<SecurityIcon />}
                  color="warning.main"
                  onClick={() => navigate('/add-admin')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="System Settings"
                  description="Configure system preferences"
                  icon={<SettingsIcon />}
                  color="success.main"
                  onClick={() => navigate('/admin/settings')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="Export Data"
                  description="Export applications to Excel"
                  icon={<DocumentIcon />}
                  color="grey.600"
                  onClick={() => handleExportCompleted()}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Recent Customers
            </Typography>
            {stats.recentCustomers.length > 0 ? (
              <List>
                {stats.recentCustomers.map((customer, index) => (
                  <React.Fragment key={customer.id}>
                    <ListItem 
                      sx={{ 
                        px: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {customer.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {customer.company || 'No company'}
                            </Typography>
                            <Chip
                              label={customer.credit_application_status || 'Active'}
                              size="small"
                              sx={{ mt: 0.5, fontSize: '0.75rem' }}
                              color={customer.credit_application_status === 'Approved' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < stats.recentCustomers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No customers yet. Create your first customer to get started!
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/customers')}
                sx={{ borderRadius: 2 }}
              >
                View All
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleExportCompleted}
                sx={{ borderRadius: 2 }}
                size="small"
              >
                Export Completed
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 