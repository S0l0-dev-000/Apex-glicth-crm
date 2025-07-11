import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const EmailCommunication = ({ customerId, customerEmail }) => {
  const [emails, setEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailForm, setEmailForm] = useState({
    to: customerEmail || '',
    subject: '',
    body: '',
    template: ''
  });

  const emailTemplates = [
    {
      name: 'Welcome Email',
      subject: 'Welcome to APEX GLITCH CRM',
      body: `Dear ${customerEmail ? customerEmail.split('@')[0] : 'Customer'},

Welcome to APEX GLITCH CRM! We're excited to have you as part of our system.

Our team is here to support you with all your business needs. If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
The APEX GLITCH Team`
    },
    {
      name: 'Credit Application Follow-up',
      subject: 'Credit Application Status Update',
      body: `Dear ${customerEmail ? customerEmail.split('@')[0] : 'Customer'},

Thank you for your credit application. We are currently reviewing your information and will provide you with an update within 3-5 business days.

If you have any additional documents to submit or questions about your application, please contact us.

Best regards,
APEX GLITCH Credit Team`
    },
    {
      name: 'Document Request',
      subject: 'Additional Documents Required',
      body: `Dear ${customerEmail ? customerEmail.split('@')[0] : 'Customer'},

To complete your application process, we need the following additional documents:

1. Recent bank statements (last 3 months)
2. Business financial statements
3. Personal tax returns (last 2 years)
4. Business license or registration

Please upload these documents through our secure portal or reply to this email with the attachments.

Best regards,
APEX GLITCH Documentation Team`
    },
    {
      name: 'Approval Notification',
      subject: 'Credit Application Approved',
      body: `Dear ${customerEmail ? customerEmail.split('@')[0] : 'Customer'},

Congratulations! Your credit application has been approved.

Credit Limit: $[AMOUNT]
Terms: Net 30 days
Effective Date: [DATE]

You can now place orders using your approved credit line. If you have any questions about your account or terms, please contact us.

Best regards,
APEX GLITCH Credit Team`
    }
  ];

  const fetchEmails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customers/${customerId}/emails`);
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId && customerId !== 'new') {
      fetchEmails();
    }
  }, [customerId, fetchEmails]);

  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    setSending(true);
    setMessage('');

    try {
              await axios.post(`${API_BASE_URL}/api/customers/${customerId}/emails`, {
        to: emailForm.to,
        subject: emailForm.subject,
        body: emailForm.body,
        template: emailForm.template
      });

      setMessage('Email sent successfully!');
      setMessageType('success');
      setComposeOpen(false);
      setEmailForm({
        to: customerEmail || '',
        subject: '',
        body: '',
        template: ''
      });
      fetchEmails();
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Error sending email');
      setMessageType('error');
    } finally {
      setSending(false);
    }
  };

  const handleTemplateChange = (templateName) => {
    const template = emailTemplates.find(t => t.name === templateName);
    if (template) {
      setEmailForm({
        ...emailForm,
        subject: template.subject,
        body: template.body,
        template: templateName
      });
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/customers/${customerId}/emails/${emailId}`);
        setMessage('Email deleted successfully!');
        setMessageType('success');
        fetchEmails();
      } catch (error) {
        console.error('Error deleting email:', error);
        setMessage('Error deleting email');
        setMessageType('error');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'pending':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      default:
        return <EmailIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!customerId || customerId === 'new') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <EmailIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Save Customer First
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please save the customer information before managing email communications
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Email Communication
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Compose Email Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={() => setComposeOpen(true)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          Compose Email
        </Button>
      </Box>

      {/* Email History */}
      {emails.length > 0 ? (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Email History ({emails.length})
          </Typography>
          
          <Grid container spacing={2}>
            {emails.map((email) => (
              <Grid item xs={12} key={email.id}>
                <Card 
                  sx={{ 
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getStatusIcon(email.status)}
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {email.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          To: {email.to} • {formatDate(email.sent_at)}
                        </Typography>
                      </Box>
                      <Chip
                        label={email.status}
                        size="small"
                        color={email.status === 'sent' ? 'success' : email.status === 'failed' ? 'error' : 'warning'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {email.body.length > 200 ? `${email.body.substring(0, 200)}...` : email.body}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Email">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Show full email content
                            alert(`Subject: ${email.subject}\n\n${email.body}`);
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reply">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEmailForm({
                              to: email.to,
                              subject: `Re: ${email.subject}`,
                              body: `\n\n--- Original Message ---\n${email.body}`,
                              template: ''
                            });
                            setComposeOpen(true);
                          }}
                          sx={{ color: 'secondary.main' }}
                        >
                          <ReplyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Forward">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEmailForm({
                              to: '',
                              subject: `Fwd: ${email.subject}`,
                              body: `\n\n--- Forwarded Message ---\nFrom: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`,
                              template: ''
                            });
                            setComposeOpen(true);
                          }}
                          sx={{ color: 'info.main' }}
                        >
                          <ForwardIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEmail(email.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <Paper sx={{ textAlign: 'center', py: 6, px: 4 }}>
          <EmailIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No emails sent yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start communicating with this customer by sending your first email
          </Typography>
        </Paper>
      )}

      {/* Compose Email Dialog */}
      <Dialog 
        open={composeOpen} 
        onClose={() => setComposeOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Compose Email
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Email Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    handleTemplateChange(e.target.value);
                  }}
                  label="Email Template"
                >
                  <MenuItem value="">No Template</MenuItem>
                  {emailTemplates.map((template) => (
                    <MenuItem key={template.name} value={template.name}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={8}
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setComposeOpen(false)}
            sx={{ px: 3, py: 1, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendEmail}
            disabled={sending}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
            }}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailCommunication; 