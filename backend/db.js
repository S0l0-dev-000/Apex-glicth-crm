const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'crm.db'), (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      company TEXT,
      notes TEXT,
      goal_overview TEXT,
      personal_information TEXT,
      address TEXT,
      birthday TEXT,
      job_title TEXT,
      industry TEXT,
      -- Business Information Section
      company_size TEXT,
      annual_revenue TEXT,
      website TEXT,
      linkedin_url TEXT,
      twitter_url TEXT,
      facebook_url TEXT,
      business_type TEXT,
      founded_year TEXT,
      employee_count TEXT,
      business_address TEXT,
      business_phone TEXT,
      tax_id TEXT,
      payment_terms TEXT,
      credit_limit TEXT,
      -- Business Financial Information Section
      credit_score TEXT,
      outstanding_balance TEXT,
      total_purchases TEXT,
      average_order_value TEXT,
      last_payment_date TEXT,
      payment_history TEXT,
      financial_rating TEXT,
      risk_assessment TEXT,
      bank_references TEXT,
      insurance_info TEXT,
      financial_statements TEXT,
      cash_flow_status TEXT,
      debt_to_income_ratio TEXT,
      profit_margin TEXT,
      -- Business Credit Information Section
      credit_report_link TEXT,
      credit_report_date TEXT,
      credit_bureau TEXT,
      credit_limit_requested TEXT,
      credit_application_status TEXT,
      credit_documents_uploaded TEXT,
      credit_history_summary TEXT,
      credit_notes TEXT,
      credit_approval_date TEXT,
      credit_review_date TEXT,
      credit_conditions TEXT,
      credit_guarantor TEXT,
      credit_collateral TEXT,
      credit_terms_approved TEXT,
      credit_monitoring_status TEXT,
      duns_number TEXT,
      business_credit_score TEXT,
      paydex_score TEXT,
      business_failure_score TEXT,
      business_credit_utilization TEXT,
      -- Personal Credit Information Section
      personal_credit_score TEXT,
      personal_credit_report_link TEXT,
      personal_credit_report_date TEXT,
      personal_credit_bureau TEXT,
      personal_credit_history TEXT,
      personal_credit_notes TEXT,
      personal_credit_application_status TEXT,
      personal_credit_limit_requested TEXT,
      personal_credit_approval_date TEXT,
      personal_credit_review_date TEXT,
      personal_credit_conditions TEXT,
      personal_credit_guarantor TEXT,
      personal_credit_collateral TEXT,
      personal_credit_terms_approved TEXT,
      personal_credit_monitoring_status TEXT,
      personal_credit_documents_uploaded TEXT,
      -- Email Communication Section
      email_preferences TEXT,
      email_template_category TEXT,
      last_email_sent TEXT,
      email_frequency TEXT,
      email_opt_in_status TEXT,
      email_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create documents table for file uploads
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      category TEXT,
      description TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db; 