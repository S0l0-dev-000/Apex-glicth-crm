import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DocumentUpload from './DocumentUpload';
import EmailCommunication from './EmailCommunication';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    website: '',
    credit_application_status: 'Pending',

    // Personal Information
    date_of_birth: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',

    // Goal Overview
    business_goals: '',
    target_market: '',
    competitive_advantages: '',
    growth_strategy: '',

    // Business Information
    business_type: '',
    business_structure: '',
    years_in_business: '',
    number_of_employees: '',
    annual_revenue: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_zip_code: '',
    business_phone: '',
    business_email: '',
    business_website: '',

    // Business Financial Information
    business_bank_name: '',
    business_account_number: '',
    business_routing_number: '',
    business_account_type: '',
    business_monthly_revenue: '',
    business_monthly_expenses: '',
    business_profit_margin: '',
    business_cash_flow: '',

    // Business Credit Information
    business_credit_bureau: '',
    business_credit_score: '',
    duns_number: '',
    paydex_score: '',
    business_failure_score: '',
    business_credit_limit: '',
    business_credit_utilization: '',
    business_payment_history: '',

    // Personal Credit Information
    personal_credit_bureau: '',
    personal_credit_score: '',
    personal_credit_limit: '',
    personal_credit_utilization: '',
    personal_payment_history: '',
    personal_debt_to_income: '',
    personal_income: '',
    personal_employment_status: ''
  });

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setMessage('Error fetching customer data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCustomer();
    }
  }, [id, fetchCustomer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (id && id !== 'new') {
        await axios.put(`${API_BASE_URL}/api/customers/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Customer updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/customers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Customer created successfully!');
      }
      setMessageType('success');
      setTimeout(() => {
        navigate('/customers');
      }, 2000);
    } catch (error) {
      console.error('Error saving customer:', error);
      setMessage('Error saving customer data');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customers')}
            sx={{ mr: 2 }}
          >
            Back to Customers
          </Button>
        </Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {id && id !== 'new' ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {id && id !== 'new' ? 'Update customer information and details' : 'Create a new customer profile with comprehensive information'}
        </Typography>
      </Box>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Tabs for different sections */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: '48px',
              },
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Customer Information" 
              iconPosition="start"
            />
            <Tab 
              icon={<DescriptionIcon />} 
              label="Documents" 
              iconPosition="start"
            />
            <Tab 
              icon={<EmailIcon />} 
              label="Email Communication" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <form onSubmit={handleSubmit}>
            {/* Accordion Sections */}
            <Box>
            <Accordion 
              defaultExpanded
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Credit Application Status"
                      value={formData.credit_application_status}
                      onChange={(e) => handleInputChange('credit_application_status', e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Denied">Denied</option>
                    </TextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SSN"
                      value={formData.ssn}
                      onChange={(e) => handleInputChange('ssn', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Goal Overview
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Business Goals"
                      value={formData.business_goals}
                      onChange={(e) => handleInputChange('business_goals', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Target Market"
                      value={formData.target_market}
                      onChange={(e) => handleInputChange('target_market', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Competitive Advantages"
                      value={formData.competitive_advantages}
                      onChange={(e) => handleInputChange('competitive_advantages', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Growth Strategy"
                      value={formData.growth_strategy}
                      onChange={(e) => handleInputChange('growth_strategy', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Business Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Type"
                      value={formData.business_type}
                      onChange={(e) => handleInputChange('business_type', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Structure"
                      value={formData.business_structure}
                      onChange={(e) => handleInputChange('business_structure', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Years in Business"
                      value={formData.years_in_business}
                      onChange={(e) => handleInputChange('years_in_business', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Number of Employees"
                      value={formData.number_of_employees}
                      onChange={(e) => handleInputChange('number_of_employees', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Annual Revenue"
                      value={formData.annual_revenue}
                      onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Phone"
                      value={formData.business_phone}
                      onChange={(e) => handleInputChange('business_phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Email"
                      type="email"
                      value={formData.business_email}
                      onChange={(e) => handleInputChange('business_email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Website"
                      value={formData.business_website}
                      onChange={(e) => handleInputChange('business_website', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Address"
                      value={formData.business_address}
                      onChange={(e) => handleInputChange('business_address', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Business City"
                      value={formData.business_city}
                      onChange={(e) => handleInputChange('business_city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Business State"
                      value={formData.business_state}
                      onChange={(e) => handleInputChange('business_state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Business ZIP Code"
                      value={formData.business_zip_code}
                      onChange={(e) => handleInputChange('business_zip_code', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Business Financial Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Bank Name"
                      value={formData.business_bank_name}
                      onChange={(e) => handleInputChange('business_bank_name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Account Number"
                      value={formData.business_account_number}
                      onChange={(e) => handleInputChange('business_account_number', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Routing Number"
                      value={formData.business_routing_number}
                      onChange={(e) => handleInputChange('business_routing_number', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Account Type"
                      value={formData.business_account_type}
                      onChange={(e) => handleInputChange('business_account_type', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monthly Revenue"
                      value={formData.business_monthly_revenue}
                      onChange={(e) => handleInputChange('business_monthly_revenue', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monthly Expenses"
                      value={formData.business_monthly_expenses}
                      onChange={(e) => handleInputChange('business_monthly_expenses', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Profit Margin"
                      value={formData.business_profit_margin}
                      onChange={(e) => handleInputChange('business_profit_margin', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cash Flow"
                      value={formData.business_cash_flow}
                      onChange={(e) => handleInputChange('business_cash_flow', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Business Credit Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Business Credit Bureau"
                      value={formData.business_credit_bureau}
                      onChange={(e) => handleInputChange('business_credit_bureau', e.target.value)}
                    >
                      <option value="">Select Bureau</option>
                      <option value="Dun & Bradstreet">Dun & Bradstreet</option>
                      <option value="Experian Business">Experian Business</option>
                      <option value="Equifax Business">Equifax Business</option>
                      <option value="FICO SBSS">FICO SBSS</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Credit Score"
                      value={formData.business_credit_score}
                      onChange={(e) => handleInputChange('business_credit_score', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="D-U-N-S Number"
                      value={formData.duns_number}
                      onChange={(e) => handleInputChange('duns_number', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Paydex Score"
                      value={formData.paydex_score}
                      onChange={(e) => handleInputChange('paydex_score', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Failure Score"
                      value={formData.business_failure_score}
                      onChange={(e) => handleInputChange('business_failure_score', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Credit Limit"
                      value={formData.business_credit_limit}
                      onChange={(e) => handleInputChange('business_credit_limit', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Credit Utilization"
                      value={formData.business_credit_utilization}
                      onChange={(e) => handleInputChange('business_credit_utilization', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Payment History"
                      value={formData.business_payment_history}
                      onChange={(e) => handleInputChange('business_payment_history', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Credit Information
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Personal Credit Bureau"
                      value={formData.personal_credit_bureau}
                      onChange={(e) => handleInputChange('personal_credit_bureau', e.target.value)}
                    >
                      <option value="">Select Bureau</option>
                      <option value="Experian">Experian</option>
                      <option value="Equifax">Equifax</option>
                      <option value="TransUnion">TransUnion</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personal Credit Score"
                      value={formData.personal_credit_score}
                      onChange={(e) => handleInputChange('personal_credit_score', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personal Credit Limit"
                      value={formData.personal_credit_limit}
                      onChange={(e) => handleInputChange('personal_credit_limit', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personal Credit Utilization"
                      value={formData.personal_credit_utilization}
                      onChange={(e) => handleInputChange('personal_credit_utilization', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personal Payment History"
                      value={formData.personal_payment_history}
                      onChange={(e) => handleInputChange('personal_payment_history', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Debt to Income Ratio"
                      value={formData.personal_debt_to_income}
                      onChange={(e) => handleInputChange('personal_debt_to_income', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personal Income"
                      value={formData.personal_income}
                      onChange={(e) => handleInputChange('personal_income', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Employment Status"
                      value={formData.personal_employment_status}
                      onChange={(e) => handleInputChange('personal_employment_status', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/customers')}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              {saving ? 'Saving...' : (id && id !== 'new' ? 'Update Customer' : 'Save Customer')}
            </Button>
          </Box>
        </form>
        )}

        {/* Documents Tab */}
        {activeTab === 1 && (
          <DocumentUpload customerId={id} />
        )}

        {/* Email Communication Tab */}
        {activeTab === 2 && (
          <EmailCommunication customerId={id} customerEmail={formData.email} />
        )}
      </Paper>
    </Box>
  );
};

export default CustomerForm; 