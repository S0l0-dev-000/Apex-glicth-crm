const nodemailer = require('nodemailer');

// Create transporter for SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send notification email when customer form is completed
const sendCustomerNotification = async (customerData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'your-email@gmail.com', // Your email
      subject: '🎉 New Customer Added - APEX GLITCH CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">APEX GLITCH CRM</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">New Customer Notification</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">🎯 New Customer Added</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">Customer Information</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.company || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Address:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">City:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.city || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">State:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.state || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Zip Code:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.zip_code || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Notes:</td>
                  <td style="padding: 8px 0; color: #333;">${customerData.notes || 'N/A'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>📋 Next Steps:</strong><br>
                • Review customer information<br>
                • Check for required documents<br>
                • Follow up on any pending items
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 14px;">
                This notification was sent automatically by APEX GLITCH CRM
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send notification when documents are uploaded
const sendDocumentNotification = async (customerData, documentData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'your-email@gmail.com',
      subject: '📄 New Document Uploaded - APEX GLITCH CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">APEX GLITCH CRM</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Document Upload Notification</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">📄 New Document Uploaded</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${customerData.name || 'N/A'}</p>
              <p><strong>Email:</strong> ${customerData.email || 'N/A'}</p>
              
              <h3 style="color: #667eea; margin-top: 20px;">Document Details</h3>
              <p><strong>File Name:</strong> ${documentData.original_filename || 'N/A'}</p>
              <p><strong>Category:</strong> ${documentData.category || 'N/A'}</p>
              <p><strong>File Size:</strong> ${(documentData.file_size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>File Type:</strong> ${documentData.file_type || 'N/A'}</p>
              <p><strong>Description:</strong> ${documentData.description || 'N/A'}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>📋 Action Required:</strong><br>
                • Review the uploaded document<br>
                • Verify document authenticity<br>
                • Update customer status if needed
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Document notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending document notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCustomerNotification,
  sendDocumentNotification
}; 