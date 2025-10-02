const GOOGLE_SHEETS_CONFIG = {
    webAppUrl: '',
    enabled: false
};

function setGoogleSheetsUrl(url) {
    GOOGLE_SHEETS_CONFIG.webAppUrl = url;
    GOOGLE_SHEETS_CONFIG.enabled = url && url.trim() !== '';
    localStorage.setItem('googleSheetsWebAppUrl', url);
}

function loadGoogleSheetsConfig() {
    const savedUrl = localStorage.getItem('googleSheetsWebAppUrl');
    if (savedUrl) {
        GOOGLE_SHEETS_CONFIG.webAppUrl = savedUrl;
        GOOGLE_SHEETS_CONFIG.enabled = true;
    }
}

async function syncUserToGoogleSheets(userData) {
    if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
        console.log('Google Sheets sync is not enabled');
        return { success: false, reason: 'not_configured' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                aadhaar: userData.aadhaar,
                phone: userData.phone,
                email: userData.email,
                address: userData.address,
                familyMembers: userData.familyMembers,
                createdAt: userData.createdAt
            })
        });
        
        console.log('User data synced to Google Sheets successfully');
        return { success: true, timestamp: new Date().toISOString() };
        
    } catch (error) {
        console.error('Failed to sync to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

async function getUsersFromGoogleSheets() {
    if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
        console.log('Google Sheets sync is not enabled');
        return { success: false, reason: 'not_configured' };
    }
    
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'GET'
        });
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Failed to fetch from Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

function showGoogleSheetsSetup() {
    const currentUrl = GOOGLE_SHEETS_CONFIG.webAppUrl || '';
    const newUrl = prompt(
        'Enter your Google Apps Script Web App URL:\n\n' +
        'To get this URL:\n' +
        '1. Copy the code from google-apps-script.js\n' +
        '2. Go to https://script.google.com/\n' +
        '3. Create a new project and paste the code\n' +
        '4. Deploy as Web App (Anyone can access)\n' +
        '5. Copy the deployment URL and paste it here',
        currentUrl
    );
    
    if (newUrl !== null) {
        setGoogleSheetsUrl(newUrl.trim());
        if (newUrl.trim()) {
            alert('Google Sheets sync configured successfully!');
        } else {
            alert('Google Sheets sync disabled');
        }
    }
}

loadGoogleSheetsConfig();
