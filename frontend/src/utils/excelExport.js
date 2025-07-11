import * as XLSX from 'xlsx';

/**
 * Export customers data to Excel file
 * @param {Array} customers - Array of customer objects
 * @param {string} filename - Name of the Excel file
 * @param {string} filterType - Type of filter to apply ('all', 'completed', 'approved', 'pending', 'denied')
 */
export const exportCustomersToExcel = (customers, filename = 'customers_export', filterType = 'all') => {
  try {
    // Filter customers based on type
    let filteredCustomers = customers;
    
    switch (filterType) {
      case 'completed':
      case 'approved':
        filteredCustomers = customers.filter(c => 
          c.credit_application_status === 'Approved' || 
          c.credit_application_status === 'approved'
        );
        break;
      case 'pending':
        filteredCustomers = customers.filter(c => 
          c.credit_application_status === 'Pending' || 
          c.credit_application_status === 'pending' ||
          !c.credit_application_status
        );
        break;
      case 'denied':
        filteredCustomers = customers.filter(c => 
          c.credit_application_status === 'Denied' || 
          c.credit_application_status === 'denied'
        );
        break;
      default:
        // Keep all customers
        break;
    }

    if (filteredCustomers.length === 0) {
      alert(`No ${filterType} applications found to export.`);
      return;
    }

    // Format data for Excel export
    const excelData = filteredCustomers.map(customer => ({
      'ID': customer.id,
      'Name': customer.name || '',
      'Email': customer.email || '',
      'Phone': customer.phone || '',
      'Company': customer.company || '',
      'Industry': customer.industry || '',
      'Application Status': customer.credit_application_status || 'Pending',
      
      // Personal Information
      'Date of Birth': customer.date_of_birth || '',
      'SSN': customer.ssn ? '***-**-' + customer.ssn.slice(-4) : '', // Mask SSN for privacy
      'Address': customer.address || '',
      'City': customer.city || '',
      'State': customer.state || '',
      'Zip Code': customer.zip_code || '',
      
      // Business Information
      'Business Type': customer.business_type || '',
      'Years in Business': customer.years_in_business || '',
      'Annual Revenue': customer.annual_revenue || '',
      'Number of Employees': customer.number_of_employees || '',
      'Business Phone': customer.business_phone || '',
      'Business Address': customer.business_address || '',
      
      // Financial Information
      'Business Credit Score': customer.business_credit_score || '',
      'Personal Credit Score': customer.personal_credit_score || '',
      'DUNS Number': customer.duns_number || '',
      'Paydex Score': customer.paydex_score || '',
      
      // Application Details
      'Created Date': customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '',
      'Goals': customer.business_goals || '',
      'Notes': customer.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 5 },   // ID
      { wch: 20 },  // Name
      { wch: 25 },  // Email
      { wch: 15 },  // Phone
      { wch: 20 },  // Company
      { wch: 15 },  // Industry
      { wch: 15 },  // Status
      { wch: 12 },  // DOB
      { wch: 12 },  // SSN
      { wch: 30 },  // Address
      { wch: 15 },  // City
      { wch: 8 },   // State
      { wch: 10 },  // Zip
      { wch: 15 },  // Business Type
      { wch: 12 },  // Years
      { wch: 15 },  // Revenue
      { wch: 12 },  // Employees
      { wch: 15 },  // Business Phone
      { wch: 30 },  // Business Address
      { wch: 12 },  // Business Credit
      { wch: 12 },  // Personal Credit
      { wch: 12 },  // DUNS
      { wch: 10 },  // Paydex
      { wch: 12 },  // Created
      { wch: 40 },  // Goals
      { wch: 40 }   // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Applications');

    // Create summary sheet
    const summaryData = [
      { 'Metric': 'Total Records Exported', 'Value': filteredCustomers.length },
      { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() },
      { 'Metric': 'Filter Applied', 'Value': filterType.charAt(0).toUpperCase() + filterType.slice(1) },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'Status Breakdown', 'Value': '' }
    ];

    // Add status breakdown
    const statusCounts = {};
    filteredCustomers.forEach(customer => {
      const status = customer.credit_application_status || 'Pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      summaryData.push({ 'Metric': `${status} Applications`, 'Value': count });
    });

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${filterType}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, finalFilename);

    return {
      success: true,
      filename: finalFilename,
      recordCount: filteredCustomers.length
    };

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting data to Excel. Please try again.');
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Export analytics data to Excel
 * @param {Object} analytics - Analytics data object
 * @param {string} filename - Name of the Excel file
 */
export const exportAnalyticsToExcel = (analytics, filename = 'analytics_report') => {
  try {
    const wb = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      { 'Metric': 'Total Customers', 'Value': analytics.totalCustomers },
      { 'Metric': 'New Customers', 'Value': analytics.newCustomers },
      { 'Metric': 'Active Customers', 'Value': analytics.activeCustomers },
      { 'Metric': 'Customer Growth %', 'Value': analytics.customerGrowth },
      { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() }
    ];
    const overviewWs = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewWs, 'Overview');

    // Industry Breakdown Sheet
    if (analytics.industryBreakdown && analytics.industryBreakdown.length > 0) {
      const industryWs = XLSX.utils.json_to_sheet(analytics.industryBreakdown);
      XLSX.utils.book_append_sheet(wb, industryWs, 'Industry Breakdown');
    }

    // Status Breakdown Sheet
    if (analytics.statusBreakdown && analytics.statusBreakdown.length > 0) {
      const statusWs = XLSX.utils.json_to_sheet(analytics.statusBreakdown);
      XLSX.utils.book_append_sheet(wb, statusWs, 'Status Breakdown');
    }

    // Top Companies Sheet
    if (analytics.topCompanies && analytics.topCompanies.length > 0) {
      const companiesWs = XLSX.utils.json_to_sheet(analytics.topCompanies);
      XLSX.utils.book_append_sheet(wb, companiesWs, 'Top Companies');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    XLSX.writeFile(wb, finalFilename);

    return {
      success: true,
      filename: finalFilename
    };

  } catch (error) {
    console.error('Error exporting analytics to Excel:', error);
    alert('Error exporting analytics data. Please try again.');
    return {
      success: false,
      error: error.message
    };
  }
}; 