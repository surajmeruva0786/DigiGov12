// GOOGLE APPS SCRIPT CODE
// Deploy this code in Google Apps Script as a Web App
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Copy and paste this entire code
// 4. Click "Deploy" > "New deployment"
// 5. Choose "Web app" as deployment type
// 6. Set "Execute as" to "Me"
// 7. Set "Who has access" to "Anyone"
// 8. Click "Deploy" and copy the Web App URL
// 9. Paste the URL in your frontend code where indicated

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = 'UserRegistrations';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'Timestamp',
        'Aadhaar Number',
        'Phone Number',
        'Email',
        'Address',
        'Family Members',
        'Registration Date'
      ]);
    }
    
    const familyMembersStr = data.familyMembers ? 
      data.familyMembers.map(fm => `${fm.name} (${fm.relation}, ${fm.age})`).join('; ') : 
      'None';
    
    sheet.appendRow([
      new Date(),
      data.aadhaar,
      data.phone,
      data.email,
      data.address,
      familyMembersStr,
      data.createdAt
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'User data saved to Google Sheets',
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheetName = 'UserRegistrations';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'No data found'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const users = rows.map(row => {
    const user = {};
    headers.forEach((header, index) => {
      user[header] = row[index];
    });
    return user;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      users: users,
      count: users.length
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
