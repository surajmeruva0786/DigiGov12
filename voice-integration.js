const originalSetVoicePreference = window.setVoicePreference;
const originalShowUserDashboard = window.showUserDashboard;
const originalShowOfficialDashboard = window.showOfficialDashboard;
const originalShowGovernmentSchemes = window.showGovernmentSchemes;
const originalShowComplaints = window.showComplaints;
const originalShowChildren = window.showChildren;
const originalShowBillPayments = window.showBillPayments;
const originalShowDocuments = window.showDocuments;
const originalLogout = window.logout;

window.setVoicePreference = function(enabled) {
    const settings = {
        enabled: enabled,
        ttsEnabled: true,
        sttEnabled: true
    };
    localStorage.setItem('voiceSettings', JSON.stringify(settings));
    
    if (typeof voiceSettings !== 'undefined') {
        voiceSettings.enabled = enabled;
        voiceSettings.ttsEnabled = true;
        voiceSettings.sttEnabled = true;
        if (typeof saveVoiceSettings === 'function') saveVoiceSettings();
        if (enabled) {
            if (typeof speak === 'function') speak("Voice assistance enabled");
            if (typeof startContinuousListening === 'function') startContinuousListening();
        }
    }
    
    if (typeof currentUser !== 'undefined' && currentUser) {
        if (typeof originalShowUserDashboard === 'function') originalShowUserDashboard();
    } else if (typeof currentOfficial !== 'undefined' && currentOfficial) {
        if (typeof originalShowOfficialDashboard === 'function') originalShowOfficialDashboard();
    }
};

window.showUserDashboard = function() {
    if (typeof originalShowUserDashboard === 'function') {
        originalShowUserDashboard();
        if (typeof announceNavigation === 'function') {
            announceNavigation('dashboard');
        }
    }
};

window.showOfficialDashboard = function() {
    if (typeof originalShowOfficialDashboard === 'function') {
        originalShowOfficialDashboard();
        if (typeof announceNavigation === 'function') {
            announceNavigation('dashboard');
        }
    }
};

window.showGovernmentSchemes = function() {
    if (typeof originalShowGovernmentSchemes === 'function') {
        originalShowGovernmentSchemes();
        if (typeof announceNavigation === 'function') {
            announceNavigation('schemes');
        }
    }
};

window.showComplaints = function() {
    if (typeof originalShowComplaints === 'function') {
        originalShowComplaints();
        if (typeof announceNavigation === 'function') {
            announceNavigation('complaints');
        }
    }
};

window.showChildren = function() {
    if (typeof originalShowChildren === 'function') {
        originalShowChildren();
        if (typeof announceNavigation === 'function') {
            announceNavigation('children');
        }
    }
};

window.showBillPayments = function() {
    if (typeof originalShowBillPayments === 'function') {
        originalShowBillPayments();
        if (typeof announceNavigation === 'function') {
            announceNavigation('billPayments');
        }
    }
};

window.showDocuments = function() {
    if (typeof originalShowDocuments === 'function') {
        originalShowDocuments();
        if (typeof announceNavigation === 'function') {
            announceNavigation('documents');
        }
    }
};

window.logout = function() {
    if (typeof speak === 'function') {
        speak("Logging out. Goodbye!");
    }
    if (typeof stopListening === 'function') {
        stopListening();
    }
    if (typeof originalLogout === 'function') {
        originalLogout();
    }
};

const originalUserLoginFormHandler = document.getElementById('user-login-form');
if (originalUserLoginFormHandler) {
    const clonedForm = originalUserLoginFormHandler.cloneNode(true);
    originalUserLoginFormHandler.parentNode.replaceChild(clonedForm, originalUserLoginFormHandler);
    
    document.getElementById('user-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('user-login-phone').value;
        const password = document.getElementById('user-login-password').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.phone === phone && u.password === password);
        
        if (user) {
            window.currentUser = user;
            
            const voiceSettings = localStorage.getItem('voiceSettings');
            if (voiceSettings === null) {
                if (typeof showVoiceSetup === 'function') showVoiceSetup();
            } else {
                if (typeof announceLogin === 'function') announceLogin('user');
                if (typeof showUserDashboard === 'function') showUserDashboard();
            }
            
            document.getElementById('user-login-form').reset();
        } else {
            alert('Invalid phone number or password');
            if (typeof announceError === 'function') announceError('Invalid phone number or password');
        }
    });
}

const originalOfficialLoginFormHandler = document.getElementById('official-login-form');
if (originalOfficialLoginFormHandler) {
    const clonedOfficialForm = originalOfficialLoginFormHandler.cloneNode(true);
    originalOfficialLoginFormHandler.parentNode.replaceChild(clonedOfficialForm, originalOfficialLoginFormHandler);
    
    document.getElementById('official-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('official-login-email').value;
        const password = document.getElementById('official-login-password').value;
        
        const officials = JSON.parse(localStorage.getItem('officials') || '[]');
        const official = officials.find(o => o.email === email && o.password === password);
        
        if (official) {
            window.currentOfficial = official;
            
            const voiceSettings = localStorage.getItem('voiceSettings');
            if (voiceSettings === null) {
                if (typeof showVoiceSetup === 'function') showVoiceSetup();
            } else {
                if (typeof announceLogin === 'function') announceLogin('official');
                if (typeof showOfficialDashboard === 'function') showOfficialDashboard();
            }
            
            document.getElementById('official-login-form').reset();
        } else {
            alert('Invalid email or password');
            if (typeof announceError === 'function') announceError('Invalid email or password');
        }
    });
}

const originalUserRegisterFormHandler = document.getElementById('user-register-form');
if (originalUserRegisterFormHandler) {
    const clonedRegForm = originalUserRegisterFormHandler.cloneNode(true);
    originalUserRegisterFormHandler.parentNode.replaceChild(clonedRegForm, originalUserRegisterFormHandler);
    
    document.getElementById('user-aadhaar-photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('aadhaar-preview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Aadhaar Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('user-register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const aadhaar = document.getElementById('user-aadhaar').value;
        const phone = document.getElementById('user-phone').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const address = document.getElementById('user-address').value;
        
        const aadhaarPhotoFile = document.getElementById('user-aadhaar-photo').files[0];
        
        if (!aadhaarPhotoFile) {
            alert('Please upload Aadhaar photo');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const aadhaarPhoto = event.target.result;
            
            const familyMembers = [];
            document.querySelectorAll('.family-member').forEach(member => {
                const name = member.querySelector('.family-name').value;
                const relation = member.querySelector('.family-relation').value;
                const age = member.querySelector('.family-age').value;
                
                if (name && relation && age) {
                    familyMembers.push({ name, relation, age });
                }
            });
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.find(u => u.phone === phone)) {
                alert('User with this phone number already exists');
                return;
            }
            
            const newUser = {
                aadhaar,
                phone,
                email,
                password,
                address,
                aadhaarPhoto,
                familyMembers,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            if (typeof logActivity === 'function') {
                logActivity('user_registered', { email: email, phone: phone, aadhaar: aadhaar });
            }
            
            if (typeof announceRegistration === 'function') {
                announceRegistration();
            }
            
            alert('Registration successful! Please login.');
            if (typeof showUserLogin === 'function') showUserLogin();
            document.getElementById('user-register-form').reset();
            document.getElementById('aadhaar-preview').innerHTML = '';
        };
        
        reader.readAsDataURL(aadhaarPhotoFile);
    });
}

const originalOfficialRegisterFormHandler = document.getElementById('official-register-form');
if (originalOfficialRegisterFormHandler) {
    const clonedOfficialRegForm = originalOfficialRegisterFormHandler.cloneNode(true);
    originalOfficialRegisterFormHandler.parentNode.replaceChild(clonedOfficialRegForm, originalOfficialRegisterFormHandler);
    
    document.getElementById('official-register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('official-name').value;
        const email = document.getElementById('official-email').value;
        const password = document.getElementById('official-password').value;
        const qualification = document.getElementById('official-qualification').value;
        const department = document.getElementById('official-department').value;
        
        const officials = JSON.parse(localStorage.getItem('officials') || '[]');
        
        if (officials.find(o => o.email === email)) {
            alert('Official with this email already exists');
            return;
        }
        
        const newOfficial = {
            name,
            email,
            password,
            qualification,
            department,
            createdAt: new Date().toISOString()
        };
        
        officials.push(newOfficial);
        localStorage.setItem('officials', JSON.stringify(officials));
        
        if (typeof announceRegistration === 'function') {
            announceRegistration();
        }
        
        alert('Registration successful! Please login.');
        if (typeof showOfficialLogin === 'function') showOfficialLogin();
        document.getElementById('official-register-form').reset();
    });
}

setTimeout(() => {
    if (typeof updateVoiceUI === 'function') {
        updateVoiceUI();
    }
}, 500);
