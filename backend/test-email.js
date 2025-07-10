require('dotenv').config();
const { sendCustomerNotification, sendDocumentNotification } = require('./emailService');

// Test customer data
const testCustomer = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  company: 'Test Company Inc.',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zip_code: '12345',
  notes: 'This is a test customer for email notification testing.'
};

// Test document data
const testDocument = {
  original_filename: 'test-document.pdf',
  category: 'Business Tax Return - 2024',
  file_size: 1024000, // 1MB
  file_type: 'application/pdf',
  description: 'Test document upload notification'
};

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test customer notification
    console.log('📧 Testing customer notification...');
    const customerResult = await sendCustomerNotification(testCustomer);
    console.log('Customer notification result:', customerResult);
    
    // Test document notification
    console.log('📄 Testing document notification...');
    const documentResult = await sendDocumentNotification(testCustomer, testDocument);
    console.log('Document notification result:', documentResult);
    
    console.log('✅ Email service test completed!');
  } catch (error) {
    console.error('❌ Email service test failed:', error);
  }
}

testEmailService(); 