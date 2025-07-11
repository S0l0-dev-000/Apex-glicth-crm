# APEX GLITCH CRM - API Documentation

## 🌐 Base URL
```
Production: https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app
Development: http://localhost:3001
```

## 📋 API Endpoints

### Customer Management

#### Get All Customers
```http
GET /api/customers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "company": "Example Corp",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip_code": "12345",
    "notes": "Important client",
    "created_at": "2024-07-10T00:00:00.000Z",
    "updated_at": "2024-07-10T00:00:00.000Z"
  }
]
```

#### Get Single Customer
```http
GET /api/customers/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "company": "Example Corp",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345",
  "notes": "Important client",
  "created_at": "2024-07-10T00:00:00.000Z",
  "updated_at": "2024-07-10T00:00:00.000Z"
}
```

#### Create Customer
```http
POST /api/customers
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "company": "Example Corp",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345",
  "notes": "Important client"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "company": "Example Corp",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip_code": "12345",
  "notes": "Important client"
}
```

**Email Notification:** Sends notification email to admin when customer is created.

#### Update Customer
```http
PUT /api/customers/:id
Content-Type: application/json
```

**Request Body:** Same as Create Customer

**Response:** Updated customer object

#### Delete Customer
```http
DELETE /api/customers/:id
```

**Response:**
```json
{
  "message": "Customer deleted successfully"
}
```

### Document Management

#### Upload Document
```http
POST /api/customers/:id/documents
Content-Type: multipart/form-data
```

**Request Body:**
```
document: [file]
category: "Business Tax Return - 2024"
description: "Annual tax return for 2024"
```

**Response:**
```json
{
  "id": 1,
  "customer_id": 1,
  "filename": "1234567890-document.pdf",
  "original_filename": "tax-return-2024.pdf",
  "file_path": "/uploads/1234567890-document.pdf",
  "file_size": 1024000,
  "file_type": "application/pdf",
  "category": "Business Tax Return - 2024",
  "description": "Annual tax return for 2024",
  "uploaded_at": "2024-07-10T00:00:00.000Z",
  "message": "Document uploaded successfully"
}
```

**Email Notification:** Sends notification email to admin when document is uploaded.

#### Get Customer Documents
```http
GET /api/customers/:id/documents
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "filename": "1234567890-document.pdf",
    "original_filename": "tax-return-2024.pdf",
    "file_path": "/uploads/1234567890-document.pdf",
    "file_size": 1024000,
    "file_type": "application/pdf",
    "category": "Business Tax Return - 2024",
    "description": "Annual tax return for 2024",
    "uploaded_at": "2024-07-10T00:00:00.000Z"
  }
]
```

#### Get Single Document
```http
GET /api/documents/:id
```

**Response:** Document object

#### Download Document
```http
GET /api/documents/:id/download
```

**Response:** File download

#### Delete Document
```http
DELETE /api/documents/:id
```

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

### Email Communication

#### Send Email
```http
POST /api/customers/:id/emails
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "customer@example.com",
  "subject": "Welcome to APEX GLITCH CRM",
  "body": "Thank you for choosing our services...",
  "template": "Welcome Email"
}
```

**Response:**
```json
{
  "id": 1,
  "customer_id": 1,
  "to_email": "customer@example.com",
  "subject": "Welcome to APEX GLITCH CRM",
  "body": "Thank you for choosing our services...",
  "template": "Welcome Email",
  "status": "sent",
  "sent_at": "2024-07-10T00:00:00.000Z"
}
```

#### Get Email History
```http
GET /api/customers/:id/emails
```

**Response:**
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "to_email": "customer@example.com",
    "subject": "Welcome to APEX GLITCH CRM",
    "body": "Thank you for choosing our services...",
    "template": "Welcome Email",
    "status": "sent",
    "sent_at": "2024-07-10T00:00:00.000Z"
  }
]
```

#### Delete Email
```http
DELETE /api/customers/:id/emails/:emailId
```

**Response:**
```json
{
  "message": "Email deleted successfully"
}
```

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": "Error message description"
}
```

### Common Error Codes
- `400` - Bad Request (missing required fields)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Example Error Responses

#### Missing Required Fields
```json
{
  "error": "Name and email are required"
}
```

#### Resource Not Found
```json
{
  "error": "Customer not found"
}
```

#### File Upload Errors
```json
{
  "error": "No file uploaded"
}
```

```json
{
  "error": "Invalid file type. Only PDF, DOC, DOCX, images, and common document types are allowed."
}
```

## 📁 File Upload

### Supported File Types
- PDF documents
- Microsoft Word documents (.doc, .docx)
- Excel spreadsheets (.xls, .xlsx)
- Images (JPEG, PNG, GIF)
- Text files (.txt)

### File Size Limits
- Maximum file size: 10MB per file

### File Naming
- Original filename preserved for display
- Secure random filename for storage
- Unique timestamp-based naming

## 🔒 Security

### CORS Configuration
- Frontend domain allowed
- Credentials supported
- Preflight requests handled

### File Upload Security
- File type validation
- File size limits
- Secure file naming
- Path traversal protection

### Email Security
- SMTP authentication required
- Environment variable protection
- Non-blocking email sending

## 📊 Database Schema

### Customers Table
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  description TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template TEXT,
  status TEXT DEFAULT 'pending',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
```

## 🧪 Testing

### Test Email Service
```bash
cd backend
node test-email.js
```

### API Testing with curl

#### Create Customer
```bash
curl -X POST https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "test@example.com",
    "phone": "555-123-4567"
  }'
```

#### Get All Customers
```bash
curl https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app/api/customers
```

#### Upload Document
```bash
curl -X POST https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app/api/customers/1/documents \
  -F "document=@/path/to/file.pdf" \
  -F "category=Business Tax Return - 2024" \
  -F "description=Test document"
```

## 📈 Rate Limits

Currently no rate limiting implemented. Consider implementing for production use.

## 🔄 Versioning

API versioning not currently implemented. All endpoints use v1 implicitly.

## 📞 Support

For API issues or questions:
- Check error responses for specific issues
- Review this documentation
- Contact developer for support

---

**APEX GLITCH CRM API Documentation**  
*Last updated: July 2024* 