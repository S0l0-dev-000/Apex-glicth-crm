import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import axios from 'axios';
import { API_BASE_URL, UPLOAD_BASE_URL } from '../config';

const DocumentUpload = ({ customerId }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const documentCategories = [
    // Business Owner ID Documents
    'Business Owner ID - Front',
    'Business Owner ID - Back',
    
    // Business Bank Statements (3 months)
    'Business Bank Statement - January',
    'Business Bank Statement - February', 
    'Business Bank Statement - March',
    'Business Bank Statement - April',
    'Business Bank Statement - May',
    'Business Bank Statement - June',
    'Business Bank Statement - July',
    'Business Bank Statement - August',
    'Business Bank Statement - September',
    'Business Bank Statement - October',
    'Business Bank Statement - November',
    'Business Bank Statement - December',
    
    // Business Tax Returns (2 years)
    'Business Tax Return - 2024',
    'Business Tax Return - 2023',
    'Business Tax Return - 2022',
    'Business Tax Return - 2021',
    
    // IRS Documents
    'IRS SS-4 / EIN Application',
    'IRS EIN Confirmation Letter',
    
    // Other Common Documents
    'Business Plan',
    'Financial Statements',
    'Personal Tax Returns',
    'Personal Credit Statements',
    'Business Licenses',
    'Insurance Documents',
    'Contracts',
    'Other'
  ];

  const fetchDocuments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/customers/${customerId}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId && customerId !== 'new') {
      fetchDocuments();
    }
  }, [customerId, fetchDocuments]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (!customerId || customerId === 'new') {
      setMessage('Please save the customer first before uploading documents');
      setMessageType('warning');
      return;
    }

    setUploading(true);
    setMessage('');

    for (let file of files) {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('category', selectedCategory || 'Other');

      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_BASE_URL}/api/customers/${customerId}/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        setMessage('Documents uploaded successfully!');
        setMessageType('success');
        fetchDocuments();
      } catch (error) {
        console.error('Error uploading document:', error);
        setMessage('Error uploading document');
        setMessageType('error');
      }
    }

    setUploading(false);
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/customers/${customerId}/documents/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Document deleted successfully!');
        setMessageType('success');
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        setMessage('Error deleting document');
        setMessageType('error');
      }
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon sx={{ color: '#4caf50' }} />;
      default:
        return <InsertDriveFileIcon sx={{ color: '#2196f3' }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    if (category.includes('ID')) return 'primary';
    if (category.includes('Bank Statement')) return 'success';
    if (category.includes('Tax Return')) return 'warning';
    if (category.includes('IRS') || category.includes('EIN')) return 'error';
    return 'default';
  };

  if (!customerId || customerId === 'new') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Save Customer First
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please save the customer information before uploading documents
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Document Management
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Document Categories Guide */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: 'primary.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Required Documents Checklist
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Business Owner ID
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="Business Owner ID - Front" size="small" color="primary" />
              <Chip label="Business Owner ID - Back" size="small" color="primary" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Business Bank Statements (3 months)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="Business Bank Statement - January" size="small" color="success" />
              <Chip label="Business Bank Statement - February" size="small" color="success" />
              <Chip label="Business Bank Statement - March" size="small" color="success" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Business Tax Returns (2 years)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="Business Tax Return - 2024" size="small" color="warning" />
              <Chip label="Business Tax Return - 2023" size="small" color="warning" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              IRS Documents
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="IRS SS-4 / EIN Application" size="small" color="error" />
              <Chip label="IRS EIN Confirmation Letter" size="small" color="error" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Upload Area */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          backgroundColor: dragActive ? 'primary.50' : 'background.paper',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Upload Documents
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop files here or click to browse
        </Typography>
        
        {/* Category Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Select Document Category:
          </Typography>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '14px',
              minWidth: '250px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select a category...</option>
            {documentCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Box>

        <Button
          variant="contained"
          component="label"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
          }}
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
          />
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, TXT (Max 10MB per file)
        </Typography>
      </Paper>

      {/* Documents List */}
      {documents.length > 0 ? (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Uploaded Documents ({documents.length})
          </Typography>
          
          <Grid container spacing={2}>
            {documents.map((doc) => (
              <Grid item xs={12} md={6} lg={4} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getFileIcon(doc.filename)}
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {doc.filename}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(doc.size)} • {formatDate(doc.upload_date)}
                        </Typography>
                      </Box>
                    </Box>

                    {doc.category && (
                      <Chip
                        label={doc.category}
                        size="small"
                        color={getCategoryColor(doc.category)}
                        sx={{ mb: 2, fontWeight: 500 }}
                      />
                    )}

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Document">
                        <IconButton
                          size="small"
                          onClick={() => window.open(`${UPLOAD_BASE_URL}/uploads/${doc.filename}`, '_blank')}
                          sx={{ color: 'primary.main' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = `${UPLOAD_BASE_URL}/uploads/${doc.filename}`;
                            link.download = doc.filename;
                            link.click();
                          }}
                          sx={{ color: 'secondary.main' }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(doc.id)}
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
          <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No documents uploaded
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload documents to keep them organized with this customer
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentUpload; 