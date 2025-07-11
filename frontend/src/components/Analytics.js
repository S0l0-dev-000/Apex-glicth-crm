import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    activeCustomers: 0,
    customerGrowth: 0,
    industryBreakdown: [],
    statusBreakdown: [],
    recentActivity: [],
    topCompanies: []
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const customers = response.data;
      const now = new Date();
      const daysAgo = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
      
      // Calculate metrics
      const totalCustomers = customers.length;
      const newCustomers = customers.filter(c => new Date(c.created_at) >= daysAgo).length;
      const activeCustomers = customers.filter(c => c.credit_application_status === 'Approved').length;
      
      // Industry breakdown
      const industries = {};
      customers.forEach(c => {
        const industry = c.industry || 'Other';
        industries[industry] = (industries[industry] || 0) + 1;
      });
      
      const industryBreakdown = Object.entries(industries)
        .map(([name, count]) => ({ name, count, percentage: (count / totalCustomers * 100).toFixed(1) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Status breakdown
      const statuses = {};
      customers.forEach(c => {
        const status = c.credit_application_status || 'Pending';
        statuses[status] = (statuses[status] || 0) + 1;
      });
      
      const statusBreakdown = Object.entries(statuses)
        .map(([name, count]) => ({ name, count, percentage: (count / totalCustomers * 100).toFixed(1) }));

      // Top companies
      const companies = {};
      customers.forEach(c => {
        if (c.company) {
          companies[c.company] = (companies[c.company] || 0) + 1;
        }
      });
      
      const topCompanies = Object.entries(companies)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalCustomers,
        newCustomers,
        activeCustomers,
        customerGrowth: 12.5, // Mock growth percentage
        industryBreakdown,
        statusBreakdown,
        recentActivity: customers.slice(0, 5).map(c => ({
          action: 'Customer Created',
          customer: c.name,
          date: c.created_at
        })),
        topCompanies
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const MetricCard = ({ title, value, change, changeType, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {changeType === 'up' ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={changeType === 'up' ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 600 }}
                >
                  {change}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs last period
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ProgressCard = ({ title, data, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          {title}
        </Typography>
        <List dense>
          {data.map((item, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.count} ({item.percentage}%)
                    </Typography>
                  </Box>
                }
                secondary={
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(item.percentage)} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: color
                      }
                    }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Denied': return 'error';
      default: return 'default';
    }
  };

  const exportData = () => {
    // This would export analytics data to CSV/Excel
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Insights and metrics for your business performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={exportData}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalytics}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={analytics.totalCustomers}
            change={analytics.customerGrowth}
            changeType="up"
            icon={<PeopleIcon sx={{ color: 'white' }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="New Customers"
            value={analytics.newCustomers}
            change={25.3}
            changeType="up"
            icon={<BusinessIcon sx={{ color: 'white' }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Customers"
            value={analytics.activeCustomers}
            change={8.1}
            changeType="up"
            icon={<TrendingUpIcon sx={{ color: 'white' }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value="67.8%"
            change={3.2}
            changeType="down"
            icon={<AssessmentIcon sx={{ color: 'white' }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Industry Breakdown */}
        <Grid item xs={12} md={6}>
          <ProgressCard
            title="Industry Breakdown"
            data={analytics.industryBreakdown}
            color="#1976d2"
          />
        </Grid>

        {/* Application Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Application Status
              </Typography>
              <List dense>
                {analytics.statusBreakdown.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={item.name}
                            color={getStatusColor(item.name)}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.count}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.percentage}% of total applications
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Activity
              </Typography>
              <List dense>
                {analytics.recentActivity.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 16, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.action}: {activity.customer}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {new Date(activity.date).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Companies */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Top Companies
              </Typography>
              <List dense>
                {analytics.topCompanies.map((company, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {company.name}
                          </Typography>
                          <Chip 
                            label={`${company.count} customers`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 