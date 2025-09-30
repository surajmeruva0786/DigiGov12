let currentUser = null;
let currentOfficial = null;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showHome() {
    showScreen('home-screen');
}

function showUserLogin() {
    showScreen('user-login-screen');
}

function showUserRegister() {
    showScreen('user-register-screen');
}

function showOfficialLogin() {
    showScreen('official-login-screen');
}

function showOfficialRegister() {
    showScreen('official-register-screen');
}

function showVoiceSetup() {
    showScreen('voice-setup-screen');
}

function addFamilyMember() {
    const familyContainer = document.getElementById('family-members');
    const memberDiv = document.createElement('div');
    memberDiv.className = 'family-member';
    memberDiv.innerHTML = `
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="family-name" placeholder="Family member name">
        </div>
        <div class="form-group">
            <label>Relationship</label>
            <input type="text" class="family-relation" placeholder="e.g., Spouse, Child">
        </div>
        <div class="form-group">
            <label>Age</label>
            <input type="number" class="family-age" placeholder="Age">
        </div>
    `;
    familyContainer.appendChild(memberDiv);
}

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
        
        alert('Registration successful! Please login.');
        showUserLogin();
        document.getElementById('user-register-form').reset();
        document.getElementById('aadhaar-preview').innerHTML = '';
    };
    
    reader.readAsDataURL(aadhaarPhotoFile);
});

document.getElementById('user-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('user-login-phone').value;
    const password = document.getElementById('user-login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
        currentUser = user;
        
        const voicePreference = localStorage.getItem('voicePreference');
        if (voicePreference === null) {
            showVoiceSetup();
        } else {
            showUserDashboard();
        }
        
        document.getElementById('user-login-form').reset();
    } else {
        alert('Invalid phone number or password');
    }
});

document.getElementById('official-register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('official-name').value;
    const email = document.getElementById('official-email').value;
    const password = document.getElementById('official-password').value;
    const qualification = document.getElementById('official-qualification').value;
    const department = document.getElementById('official-department').value;
    const category = document.getElementById('official-category').value;
    
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
        category,
        createdAt: new Date().toISOString()
    };
    
    officials.push(newOfficial);
    localStorage.setItem('officials', JSON.stringify(officials));
    
    alert('Registration successful! Please login.');
    showOfficialLogin();
    document.getElementById('official-register-form').reset();
});

document.getElementById('official-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('official-login-email').value;
    const password = document.getElementById('official-login-password').value;
    
    const officials = JSON.parse(localStorage.getItem('officials') || '[]');
    const official = officials.find(o => o.email === email && o.password === password);
    
    if (official) {
        currentOfficial = official;
        
        const voicePreference = localStorage.getItem('voicePreference');
        if (voicePreference === null) {
            showVoiceSetup();
        } else {
            showOfficialDashboard();
        }
        
        document.getElementById('official-login-form').reset();
    } else {
        alert('Invalid email or password');
    }
});

function setVoicePreference(enabled) {
    localStorage.setItem('voicePreference', enabled ? 'yes' : 'no');
    
    if (currentUser) {
        showUserDashboard();
    } else if (currentOfficial) {
        showOfficialDashboard();
    }
}

function showUserDashboard() {
    document.getElementById('user-name-display').textContent = currentUser.email.split('@')[0];
    displayDashboardSummary();
    showScreen('user-dashboard-screen');
}

function displayDashboardSummary() {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const userDocuments = documents.filter(d => d.userId === currentUser.phone);
    
    const documentsSummaryEl = document.getElementById('documents-summary');
    if (userDocuments.length === 0) {
        documentsSummaryEl.innerHTML = '<p style="color: #999;">No documents uploaded yet</p>';
    } else {
        const docCounts = {};
        userDocuments.forEach(doc => {
            docCounts[doc.type] = (docCounts[doc.type] || 0) + 1;
        });
        
        documentsSummaryEl.innerHTML = Object.entries(docCounts).map(([type, count]) => `
            <div class="summary-item">
                <span>${sanitizeHTML(type)}</span>
                <strong>${count} document${count > 1 ? 's' : ''}</strong>
            </div>
        `).join('') + `
            <div class="summary-item" style="margin-top: 10px; border-top: 2px solid #667eea; padding-top: 10px;">
                <strong>Total</strong>
                <strong>${userDocuments.length} document${userDocuments.length > 1 ? 's' : ''}</strong>
            </div>
        `;
    }
    
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const userComplaints = complaints.filter(c => c.userId === currentUser.phone);
    
    const complaintsSummaryEl = document.getElementById('complaints-summary');
    if (userComplaints.length === 0) {
        complaintsSummaryEl.innerHTML = '<p style="color: #999;">No complaints filed yet</p>';
    } else {
        const statusCounts = {};
        userComplaints.forEach(complaint => {
            statusCounts[complaint.status] = (statusCounts[complaint.status] || 0) + 1;
        });
        
        complaintsSummaryEl.innerHTML = Object.entries(statusCounts).map(([status, count]) => {
            let badgeClass = 'badge-pending';
            if (status.toLowerCase() === 'resolved') badgeClass = 'badge-resolved';
            else if (status.toLowerCase() === 'in progress') badgeClass = 'badge-in-progress';
            
            return `
                <div class="summary-item">
                    <span>${sanitizeHTML(status)}</span>
                    <span class="summary-badge ${badgeClass}">${count}</span>
                </div>
            `;
        }).join('') + `
            <div class="summary-item" style="margin-top: 10px; border-top: 2px solid #667eea; padding-top: 10px;">
                <strong>Total Complaints</strong>
                <strong>${userComplaints.length}</strong>
            </div>
        `;
        
        const recentComplaints = userComplaints.slice(-3).reverse();
        if (recentComplaints.length > 0) {
            complaintsSummaryEl.innerHTML += '<p style="margin-top: 15px; font-weight: 600; color: #667eea;">Recent Updates:</p>';
            recentComplaints.forEach(complaint => {
                complaintsSummaryEl.innerHTML += `
                    <p style="font-size: 13px; margin: 5px 0;">
                        <strong>${sanitizeHTML(complaint.id)}:</strong> ${sanitizeHTML(complaint.status)} 
                        <span style="color: #999;">(${sanitizeHTML(complaint.department)})</span>
                    </p>
                `;
            });
        }
    }
}

function showOfficialDashboard() {
    document.getElementById('official-name-display').textContent = currentOfficial.name;
    document.getElementById('official-dept-display').textContent = currentOfficial.department;
    document.getElementById('official-qual-display').textContent = currentOfficial.qualification;
    
    const categoryText = currentOfficial.category === '1' ? 'Complaint Handler' : 'Verifier';
    document.getElementById('official-cat-display').textContent = categoryText;
    
    showScreen('official-dashboard-screen');
    displayOfficialComplaints();
    displayOfficialDocuments();
}

function logout() {
    currentUser = null;
    currentOfficial = null;
    showHome();
}

const stateMapping = {
    '1': 'Delhi',
    '2': 'Maharashtra',
    '3': 'Karnataka',
    '4': 'Tamil Nadu',
    '5': 'Gujarat',
    '6': 'West Bengal',
    '7': 'Rajasthan',
    '8': 'Uttar Pradesh'
};

function getStateFromAadhaar(aadhaar) {
    const firstDigit = aadhaar.charAt(0);
    return stateMapping[firstDigit] || 'Unknown';
}

function initializeSchemesData() {
    if (!localStorage.getItem('schemes')) {
        const schemes = [
            { id: 1, name: 'Pradhan Mantri Awas Yojana', description: 'Housing for all - Urban', type: 'Central', benefits: 'Financial assistance for home construction', eligibility: 'EWS/LIG families' },
            { id: 2, name: 'Ayushman Bharat', description: 'Health insurance scheme', type: 'Central', benefits: 'Rs 5 lakh health cover', eligibility: 'Below poverty line families' },
            { id: 3, name: 'PM-KISAN', description: 'Income support for farmers', type: 'Central', benefits: 'Rs 6000 per year', eligibility: 'Small and marginal farmers' },
            { id: 4, name: 'National Education Policy', description: 'Education reforms', type: 'Central', benefits: 'Free quality education', eligibility: 'All students' },
            { id: 5, name: 'Delhi Education Scheme', description: 'Free education in government schools', type: 'Delhi', benefits: 'Free books and uniforms', eligibility: 'Delhi residents' },
            { id: 6, name: 'Maharashtra Farm Support', description: 'Support for farmers', type: 'Maharashtra', benefits: 'Financial aid for crops', eligibility: 'Maharashtra farmers' },
            { id: 7, name: 'Karnataka Skill Development', description: 'Vocational training program', type: 'Karnataka', benefits: 'Free skill training', eligibility: 'Youth in Karnataka' },
            { id: 8, name: 'Tamil Nadu Health Scheme', description: 'Free healthcare services', type: 'Tamil Nadu', benefits: 'Free medical treatment', eligibility: 'Tamil Nadu residents' }
        ];
        localStorage.setItem('schemes', JSON.stringify(schemes));
    }
}

function initializeDepartments() {
    if (!localStorage.getItem('departments')) {
        const departments = [
            'Revenue Department',
            'Health Department',
            'Education Department',
            'Transport Department',
            'Water Supply',
            'Electricity Board',
            'Police Department',
            'Municipal Corporation',
            'Agriculture Department'
        ];
        localStorage.setItem('departments', JSON.stringify(departments));
    }
}

function showGovernmentSchemes() {
    initializeSchemesData();
    const state = getStateFromAadhaar(currentUser.aadhaar);
    document.getElementById('user-state-display').textContent = `State: ${state}`;
    
    displaySchemes();
    showScreen('government-schemes-screen');
}

function displaySchemes(filter = '') {
    const state = getStateFromAadhaar(currentUser.aadhaar);
    const schemes = JSON.parse(localStorage.getItem('schemes') || '[]');
    const schemesList = document.getElementById('schemes-list');
    
    const filteredSchemes = schemes.filter(scheme => {
        const matchesState = scheme.type === 'Central' || scheme.type === state;
        const matchesSearch = filter === '' || 
            scheme.name.toLowerCase().includes(filter.toLowerCase()) ||
            scheme.description.toLowerCase().includes(filter.toLowerCase()) ||
            scheme.benefits.toLowerCase().includes(filter.toLowerCase());
        return matchesState && matchesSearch;
    });
    
    if (filteredSchemes.length === 0) {
        schemesList.innerHTML = '<p style="text-align: center; color: #666;">No schemes found</p>';
        return;
    }
    
    schemesList.innerHTML = filteredSchemes.map(scheme => `
        <div class="scheme-card">
            <h4>${scheme.name}</h4>
            <p><strong>Description:</strong> ${scheme.description}</p>
            <p><strong>Benefits:</strong> ${scheme.benefits}</p>
            <p><strong>Eligibility:</strong> ${scheme.eligibility}</p>
            <span class="scheme-type">${scheme.type}</span>
        </div>
    `).join('');
}

function searchSchemes() {
    const searchTerm = document.getElementById('scheme-search').value;
    displaySchemes(searchTerm);
}

let recognition;

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        document.getElementById('scheme-search').placeholder = 'Listening...';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('scheme-search').value = transcript;
        searchSchemes();
    };
    
    recognition.onerror = function(event) {
        alert('Voice recognition error: ' + event.error);
        document.getElementById('scheme-search').placeholder = 'Search schemes...';
    };
    
    recognition.onend = function() {
        document.getElementById('scheme-search').placeholder = 'Search schemes...';
    };
    
    recognition.start();
}

function startVoiceComplaint() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('quick-complaint-text').value = transcript;
    };
    
    recognition.onerror = function(event) {
        alert('Voice recognition error: ' + event.error);
    };
    
    recognition.start();
}

function submitQuickComplaint() {
    const complaintText = document.getElementById('quick-complaint-text').value.trim();
    
    if (!complaintText) {
        alert('Please enter a complaint');
        return;
    }
    
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaintId = 'C' + Date.now();
    
    const newComplaint = {
        id: complaintId,
        userId: currentUser.phone,
        department: 'General',
        description: complaintText,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    alert('Complaint submitted successfully! ID: ' + complaintId);
    document.getElementById('quick-complaint-text').value = '';
}

function showComplaints() {
    initializeDepartments();
    displayDepartments();
    displayUserComplaints();
    showScreen('complaints-screen');
}

function displayDepartments() {
    const departments = JSON.parse(localStorage.getItem('departments') || '[]');
    const departmentsList = document.getElementById('departments-list');
    
    departmentsList.innerHTML = departments.map(dept => `
        <div class="department-card" onclick="selectDepartment('${dept}')">
            <h4>${dept}</h4>
        </div>
    `).join('');
}

let selectedDept = '';

function selectDepartment(department) {
    selectedDept = department;
    document.getElementById('selected-department').textContent = department;
    document.getElementById('complaint-form-section').style.display = 'block';
    document.getElementById('complaint-description').value = '';
}

function cancelComplaint() {
    selectedDept = '';
    document.getElementById('complaint-form-section').style.display = 'none';
    document.getElementById('complaint-description').value = '';
}

function startVoiceComplaintForm() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('complaint-description').value = transcript;
    };
    
    recognition.onerror = function(event) {
        alert('Voice recognition error: ' + event.error);
    };
    
    recognition.start();
}

document.getElementById('complaint-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('complaint-description').value.trim();
    
    if (!description) {
        alert('Please enter complaint description');
        return;
    }
    
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaintId = 'C' + Date.now();
    
    const newComplaint = {
        id: complaintId,
        userId: currentUser.phone,
        department: selectedDept,
        description: description,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    alert('Complaint submitted successfully! ID: ' + complaintId);
    
    cancelComplaint();
    displayUserComplaints();
});

function displayUserComplaints() {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const userComplaints = complaints.filter(c => c.userId === currentUser.phone);
    const complaintsItems = document.getElementById('complaints-items');
    
    if (userComplaints.length === 0) {
        complaintsItems.innerHTML = '<p style="text-align: center; color: #666;">No complaints filed yet</p>';
        return;
    }
    
    complaintsItems.innerHTML = userComplaints.map(complaint => `
        <div class="complaint-item">
            <h4>Complaint ID: ${complaint.id}</h4>
            <p><strong>Department:</strong> ${complaint.department}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Date:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
            <span class="complaint-status status-${complaint.status.toLowerCase()}">${complaint.status}</span>
        </div>
    `).join('');
}

function showChildren() {
    showScreen('children-screen');
}

function showBillPayments() {
    showScreen('bill-payments-screen');
}

function showDocuments() {
    displayUserDocuments();
    showScreen('documents-screen');

}
function showUploadDocumentForm() {
    document.getElementById('upload-document-form-section').style.display = 'block';
    document.getElementById('document-type').value = '';
    document.getElementById('document-name').value = '';
    document.getElementById('document-file').value = '';
    document.getElementById('document-preview').innerHTML = '';
}

function cancelUploadDocument() {
    document.getElementById('upload-document-form-section').style.display = 'none';
    document.getElementById('document-type').value = '';
    document.getElementById('document-name').value = '';
    document.getElementById('document-file').value = '';
    document.getElementById('document-preview').innerHTML = '';
}

document.getElementById('document-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('document-preview');
            if (file.type.startsWith('image/')) {
                preview.innerHTML = `<img src="${event.target.result}" alt="Document Preview" style="max-width: 100%; margin-top: 10px; border-radius: 8px;">`;
            } else if (file.type === 'application/pdf') {
                preview.innerHTML = `<p style="margin-top: 10px; color: #667eea;">📄 PDF file selected: ${file.name}</p>`;
            }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('upload-document-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const documentType = document.getElementById('document-type').value;
    const documentName = document.getElementById('document-name').value;
    const documentFile = document.getElementById('document-file').files[0];
    
    if (!documentFile) {
        alert('Please select a file to upload');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const documentData = event.target.result;
        
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        const documentId = 'DOC' + Date.now();
        
        const newDocument = {
            id: documentId,
            userId: currentUser.phone,
            type: documentType,
            name: documentName,
            fileName: documentFile.name,
            fileType: documentFile.type,
            fileData: documentData,
            uploadedAt: new Date().toISOString()
        };
        
        documents.push(newDocument);
        localStorage.setItem('documents', JSON.stringify(documents));
        
        alert('Document uploaded successfully!');
        cancelUploadDocument();
        displayUserDocuments();
    };
    
    reader.readAsDataURL(documentFile);
});

function displayUserDocuments() {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const userDocuments = documents.filter(d => d.userId === currentUser.phone);
    const documentsItems = document.getElementById('documents-items');
    
    if (userDocuments.length === 0) {
        documentsItems.innerHTML = '<p style="text-align: center; color: #666;">No documents uploaded yet</p>';
        return;
    }
    
    documentsItems.innerHTML = userDocuments.map(doc => `
        <div class="document-item">
            <div class="document-item-header">
                <h4>${sanitizeHTML(doc.name)}</h4>
                <span class="document-type-badge">${sanitizeHTML(doc.type)}</span>
            </div>
            <p><strong>File:</strong> ${sanitizeHTML(doc.fileName)}</p>
            <p><strong>Uploaded:</strong> ${new Date(doc.uploadedAt).toLocaleDateString()}</p>
            <div class="document-actions">
                <button class="btn-secondary" onclick=\"viewDocument('${sanitizeHTML(doc.id)}')\">View</button>
                <button class="btn-secondary" onclick=\"downloadDocument('${sanitizeHTML(doc.id)}')\">Download</button>
                <button class="btn-secondary delete-btn" onclick=\"deleteDocument('${sanitizeHTML(doc.id)}')\">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewDocument(docId) {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const doc = documents.find(d => d.id === docId);
    
    if (doc) {
        if (doc.fileType.startsWith('image/')) {
            const newWindow = window.open();
            newWindow.document.write(`<img src="${doc.fileData}" style="max-width: 100%;" />`);
        } else if (doc.fileType === 'application/pdf') {
            const newWindow = window.open();
            newWindow.document.write(`<iframe src="${doc.fileData}" width="100%" height="100%" style="border:none;"></iframe>`);
        }
    }
}

function downloadDocument(docId) {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const doc = documents.find(d => d.id === docId);
    
    if (doc) {
        const link = document.createElement('a');
        link.href = doc.fileData;
        link.download = doc.fileName;
        link.click();
    }
}

function deleteDocument_OLD(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        const updatedDocuments = documents.filter(d => d.id !== docId);
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        displayUserDocuments();
        alert('Document deleted successfully!');
    }
}

let selectedBillType
let currentBillPayment = null;
let currentChildId = null;

function speak(text) {
    const voicePreference = localStorage.getItem('voicePreference');
    if (voicePreference === 'yes' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

function showBillPayments() {
    speak("Bill Payments module. Please select the type of bill you want to pay.");
    displayPaymentHistory();
    showScreen('bill-payments-screen');
}

function selectBillType(type) {
    selectedBillType = type;
    document.getElementById('selected-bill-type').textContent = type;
    document.getElementById('bill-payment-form-section').style.display = 'block';
    document.getElementById('consumer-number').value = '';
    document.getElementById('bill-amount').value = '';
    speak(`${type} bill selected. Please enter consumer number and amount.`);
}

function cancelBillPayment() {
    selectedBillType = '';
    document.getElementById('bill-payment-form-section').style.display = 'none';
}

function startVoiceConsumerNumber() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.replace(/\s/g, '');
        document.getElementById('consumer-number').value = transcript;
        speak(`Consumer number ${transcript} entered.`);
    };
    recognition.start();
}

function startVoiceAmount() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.replace(/\D/g, '');
        document.getElementById('bill-amount').value = transcript;
        speak(`Amount ${transcript} rupees entered.`);
    };
    recognition.start();
}

document.getElementById('bill-payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const consumerNumber = document.getElementById('consumer-number').value;
    const amount = document.getElementById('bill-amount').value;
    
    currentBillPayment = {
        type: selectedBillType,
        consumerNumber,
        amount,
        timestamp: Date.now()
    };
    
    speak("Please verify your PIN to proceed with payment.");
    document.getElementById('pin-lock-modal').style.display = 'flex';
    document.getElementById('pin1').focus();
});

function movePinFocus(current, nextId) {
    if (current.value.length === 1 && nextId) {
        document.getElementById(nextId).focus();
    }
}

function submitPinVerify() {
    const pin1 = document.getElementById('pin1').value;
    const pin2 = document.getElementById('pin2').value;
    const pin3 = document.getElementById('pin3').value;
    const pin4 = document.getElementById('pin4').value;
    
    if (pin1 && pin2 && pin3 && pin4) {
        const pin = pin1 + pin2 + pin3 + pin4;
        
        if (pin === '1234') {
            closePinModal();
            speak("PIN verified successfully. Please select a UPI app.");
            document.getElementById('upi-simulation-modal').style.display = 'flex';
        } else {
            alert('Incorrect PIN. Please try again with 1234.');
            clearPinInputs();
        }
    }
}

function clearPinInputs() {
    document.getElementById('pin1').value = '';
    document.getElementById('pin2').value = '';
    document.getElementById('pin3').value = '';
    document.getElementById('pin4').value = '';
    document.getElementById('pin1').focus();
}

function closePinModal() {
    document.getElementById('pin-lock-modal').style.display = 'none';
    clearPinInputs();
}

function processUPIPayment(upiApp) {
    speak(`Redirecting to ${upiApp} for payment.`);
    
    setTimeout(() => {
        speak("Payment successful!");
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const payment = {
            id: 'P' + Date.now(),
            userId: currentUser.phone,
            billType: currentBillPayment.type,
            consumerNumber: currentBillPayment.consumerNumber,
            amount: currentBillPayment.amount,
            upiApp: upiApp,
            status: 'Success',
            timestamp: new Date().toISOString()
        };
        
        payments.push(payment);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        document.getElementById('upi-simulation-modal').style.display = 'none';
        alert(`Payment of ₹${currentBillPayment.amount} successful via ${upiApp}!`);
        
        cancelBillPayment();
        displayPaymentHistory();
    }, 1500);
}

function displayPaymentHistory() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const userPayments = payments.filter(p => p.userId === currentUser.phone);
    const historyItems = document.getElementById('payment-history-items');
    
    if (userPayments.length === 0) {
        historyItems.innerHTML = '<p style="text-align: center; color: #666;">No payment history</p>';
        return;
    }
    
    historyItems.innerHTML = userPayments.reverse().map(payment => `
        <div class="payment-item">
            <h4>${payment.billType} Bill - ₹${payment.amount}</h4>
            <p><strong>Payment ID:</strong> ${payment.id}</p>
            <p><strong>Consumer:</strong> ${payment.consumerNumber}</p>
            <p><strong>Paid via:</strong> ${payment.upiApp}</p>
            <p><strong>Date:</strong> ${new Date(payment.timestamp).toLocaleString()}</p>
            <span class="payment-status">✓ ${payment.status}</span>
        </div>
    `).join('');
}

function showChildren() {
    speak("Children module. You can add and manage child profiles here.");
    displayChildrenList();
    showScreen('children-screen');
}

function showAddChildForm() {
    document.getElementById('add-child-form-section').style.display = 'block';
    speak("Please enter child details.");
}

function cancelAddChild() {
    document.getElementById('add-child-form-section').style.display = 'none';
    document.getElementById('add-child-form').reset();
}

function startVoiceChildName() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = function(event) {
        document.getElementById('child-name').value = event.results[0][0].transcript;
    };
    recognition.start();
}

function startVoiceSchoolName() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = function(event) {
        document.getElementById('child-school').value = event.results[0][0].transcript;
    };
    recognition.start();
}

document.getElementById('add-child-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const child = {
        id: 'CH' + Date.now(),
        userId: currentUser.phone,
        name: document.getElementById('child-name').value,
        age: document.getElementById('child-age').value,
        school: document.getElementById('child-school').value,
        class: document.getElementById('child-class').value,
        attendance: [],
        vaccinations: [],
        resources: [],
        createdAt: new Date().toISOString()
    };
    
    children.push(child);
    localStorage.setItem('children', JSON.stringify(children));
    
    speak(`${child.name} added successfully.`);
    alert('Child added successfully!');
    cancelAddChild();
    displayChildrenList();
});

function displayChildrenList() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const userChildren = children.filter(c => c.userId === currentUser.phone);
    const childrenList = document.getElementById('children-list');
    
    if (userChildren.length === 0) {
        childrenList.innerHTML = '<p style="text-align: center; color: #666;">No children added yet</p>';
        return;
    }
    
    childrenList.innerHTML = userChildren.map(child => `
        <div class="child-card" onclick="viewChildDetail('${child.id}')">
            <h4>${child.name}</h4>
            <p><strong>Age:</strong> ${child.age} years</p>
            <p><strong>School:</strong> ${child.school}</p>
            <p><strong>Class:</strong> ${child.class}</p>
        </div>
    `).join('');
}

function viewChildDetail(childId) {
    currentChildId = childId;
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const child = children.find(c => c.id === childId);
    
    document.getElementById('child-detail-name').textContent = child.name;
    speak(`Viewing details for ${child.name}.`);
    
    showChildTab('attendance');
    showScreen('child-detail-screen');
}

function showChildTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    event.target?.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'attendance') {
        displayAttendance();
    } else if (tabName === 'vaccination') {
        displayVaccinations();
    } else if (tabName === 'learning') {
        displayResources();
    }
}

function displayAttendance() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const child = children.find(c => c.id === currentChildId);
    
    const today = new Date().toDateString();
    const streak = calculateStreak(child.attendance);
    
    document.getElementById('streak-number').textContent = streak;
    
    const calendar = document.getElementById('attendance-calendar');
    calendar.innerHTML = child.attendance.slice(-7).map(date => `
        <div class="attendance-day">
            <span>✓</span>
            <p>${new Date(date).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function calculateStreak(attendance) {
    if (!attendance || attendance.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    
    for (let i = attendance.length - 1; i >= 0; i--) {
        const attDate = new Date(attendance[i]).setHours(0, 0, 0, 0);
        const expectedDate = today - (streak * 24 * 60 * 60 * 1000);
        
        if (attDate === expectedDate) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

function markAttendance() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const childIndex = children.findIndex(c => c.id === currentChildId);
    
    const today = new Date().toDateString();
    
    if (children[childIndex].attendance.some(d => new Date(d).toDateString() === today)) {
        alert('Attendance already marked for today!');
        return;
    }
    
    children[childIndex].attendance.push(new Date().toISOString());
    localStorage.setItem('children', JSON.stringify(children));
    
    speak("Attendance marked successfully.");
    alert('Attendance marked!');
    displayAttendance();
    
    const streak = calculateStreak(children[childIndex].attendance);
    if (streak > 0 && streak % 7 === 0) {
        setTimeout(() => speak(`Great job! ${streak} day streak achieved!`), 1000);
    }
}

function showAddVaccineForm() {
    document.getElementById('add-vaccine-form').style.display = 'block';
}

function cancelAddVaccine() {
    document.getElementById('add-vaccine-form').style.display = 'none';
    document.getElementById('vaccine-form').reset();
}

document.getElementById('vaccine-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const childIndex = children.findIndex(c => c.id === currentChildId);
    
    const vaccination = {
        id: 'V' + Date.now(),
        name: document.getElementById('vaccine-name').value,
        dueDate: document.getElementById('vaccine-date').value,
        status: 'Pending'
    };
    
    children[childIndex].vaccinations.push(vaccination);
    localStorage.setItem('children', JSON.stringify(children));
    
    speak(`Vaccination reminder for ${vaccination.name} added.`);
    alert('Vaccination reminder added!');
    cancelAddVaccine();
    displayVaccinations();
    
    checkVaccinationReminders();
});

function displayVaccinations() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const child = children.find(c => c.id === currentChildId);
    const vaccList = document.getElementById('vaccination-list');
    
    if (!child.vaccinations || child.vaccinations.length === 0) {
        vaccList.innerHTML = '<p style="text-align: center; color: #666;">No vaccinations added</p>';
        return;
    }
    
    vaccList.innerHTML = child.vaccinations.map(vacc => {
        const daysUntil = Math.ceil((new Date(vacc.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntil < 0;
        const isDueSoon = daysUntil >= 0 && daysUntil <= 7;
        
        return `
            <div class="vaccination-item ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}">
                <h4>${vacc.name}</h4>
                <p><strong>Due Date:</strong> ${new Date(vacc.dueDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${vacc.status}</p>
                ${isOverdue ? '<p class="warning">⚠️ Overdue!</p>' : ''}
                ${isDueSoon && !isOverdue ? '<p class="info">📅 Due soon!</p>' : ''}
            </div>
        `;
    }).join('');
}

function checkVaccinationReminders() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const userChildren = children.filter(c => c.userId === currentUser.phone);
    
    userChildren.forEach(child => {
        child.vaccinations?.forEach(vacc => {
            const daysUntil = Math.ceil((new Date(vacc.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            if (daysUntil === 0) {
                speak(`Reminder: ${child.name}'s ${vacc.name} vaccination is due today.`);
            } else if (daysUntil === 1) {
                speak(`Reminder: ${child.name}'s ${vacc.name} vaccination is due tomorrow.`);
            }
        });
    });
}

function showAddResourceForm() {
    document.getElementById('add-resource-form').style.display = 'block';
    
    document.getElementById('resource-type').addEventListener('change', function() {
        const type = this.value;
        document.getElementById('resource-file').style.display = type === 'PDF' ? 'block' : 'none';
        document.getElementById('resource-url').style.display = type !== 'PDF' ? 'block' : 'none';
    });
}

function cancelAddResource() {
    document.getElementById('add-resource-form').style.display = 'none';
    document.getElementById('resource-form').reset();
}

document.getElementById('resource-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const childIndex = children.findIndex(c => c.id === currentChildId);
    
    const type = document.getElementById('resource-type').value;
    let resourceData = '';
    
    if (type === 'PDF') {
        const file = document.getElementById('resource-file').files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const resource = {
                    id: 'R' + Date.now(),
                    title: document.getElementById('resource-title').value,
                    type: type,
                    data: event.target.result,
                    addedAt: new Date().toISOString()
                };
                
                children[childIndex].resources.push(resource);
                localStorage.setItem('children', JSON.stringify(children));
                
                speak(`Resource ${resource.title} added successfully.`);
                alert('Resource added!');
                cancelAddResource();
                displayResources();
            };
            reader.readAsDataURL(file);
        }
    } else {
        const resource = {
            id: 'R' + Date.now(),
            title: document.getElementById('resource-title').value,
            type: type,
            data: document.getElementById('resource-url').value,
            addedAt: new Date().toISOString()
        };
        
        children[childIndex].resources.push(resource);
        localStorage.setItem('children', JSON.stringify(children));
        
        speak(`Resource ${resource.title} added successfully.`);
        alert('Resource added!');
        cancelAddResource();
        displayResources();
    }
});

function displayResources() {
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const child = children.find(c => c.id === currentChildId);
    const resourcesList = document.getElementById('resources-list');
    
    if (!child.resources || child.resources.length === 0) {
        resourcesList.innerHTML = '<p style="text-align: center; color: #666;">No resources added</p>';
        return;
    }
    
    resourcesList.innerHTML = child.resources.map(resource => `
        <div class="resource-item">
            <h4>${resource.title}</h4>
            <p><strong>Type:</strong> ${resource.type}</p>
            <p><strong>Added:</strong> ${new Date(resource.addedAt).toLocaleDateString()}</p>
            ${resource.type === 'PDF' ? 
                `<a href="${resource.data}" download="${resource.title}.pdf" class="btn-secondary">Download PDF</a>` :
                `<a href="${resource.data}" target="_blank" class="btn-secondary">Open Link</a>`
            }
        </div>
    `).join('');
}

setInterval(checkVaccinationReminders, 60000);

window.addEventListener('load', function() {
    if (currentUser) {
        checkVaccinationReminders();
    }
});

function displayOfficialComplaints() {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const deptComplaints = complaints.filter(c => c.department === currentOfficial.department || c.department === 'General');
    const complaintsListEl = document.getElementById('official-complaints-list');
    document.getElementById('official-dept-complaints').textContent = currentOfficial.department;
    
    if (deptComplaints.length === 0) {
        complaintsListEl.innerHTML = '<p style="text-align: center; color: #666;">No complaints for your department</p>';
        return;
    }
    
    complaintsListEl.innerHTML = deptComplaints.map(complaint => `
        <div class="complaint-item" onclick="viewComplaintDetail('${complaint.id}')">
            <h4>Complaint ID: ${complaint.id}</h4>
            <p><strong>Department:</strong> ${complaint.department}</p>
            <p><strong>Description:</strong> ${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}</p>
            <p><strong>Date:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
            <p><strong>User Phone:</strong> ${complaint.userId}</p>
            <span class="complaint-status status-${complaint.status.toLowerCase().replace(/ /g, '.')}">${complaint.status}</span>
        </div>
    `).join('');
}

function viewComplaintDetail(complaintId) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaint = complaints.find(c => c.id === complaintId);
    
    if (!complaint) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === complaint.userId);
    
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const userDocuments = documents.filter(d => d.userId === complaint.userId);
    
    let detailContent = `
        <p><strong>Complaint ID:</strong> ${complaint.id}</p>
        <p><strong>Department:</strong> ${complaint.department}</p>
        <p><strong>Status:</strong> <span class="complaint-status status-${complaint.status.toLowerCase().replace(/ /g, '.')}">${complaint.status}</span></p>
        <p><strong>Description:</strong> ${complaint.description}</p>
        <p><strong>Date:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
        <p><strong>User:</strong> ${user ? user.email : complaint.userId}</p>
    `;
    
    if (userDocuments.length > 0) {
        detailContent += `<p><strong>User Documents:</strong></p><div class="user-documents-list">`;
        userDocuments.forEach(doc => {
            detailContent += `<button class="btn-secondary" onclick="viewOfficialDocument('${doc.id}')" style="margin: 5px;">${doc.name} (${doc.type})</button>`;
        });
        detailContent += `</div>`;
    }
    
    document.getElementById('complaint-detail-content').innerHTML = detailContent;
    
    let actionsHtml = '';
    if (currentOfficial.category === '1') {
        if (complaint.status === 'Pending' || complaint.status === 'In Progress') {
            actionsHtml = `
                <button class="btn-primary" onclick="updateComplaintStatus('${complaint.id}', 'In Progress')">Mark In Progress</button>
                <button class="btn-primary" onclick="updateComplaintStatus('${complaint.id}', 'Resolved')">Mark Resolved</button>
            `;
        }
    } else if (currentOfficial.category === '2') {
        if (complaint.status === 'Resolved') {
            actionsHtml = `
                <button class="btn-primary" onclick="verifyComplaint('${complaint.id}')">Verify Resolution</button>
            `;
        }
    }
    
    document.getElementById('complaint-actions-section').innerHTML = actionsHtml;
    document.getElementById('complaint-detail-modal').style.display = 'flex';
}

function closeComplaintDetailModal() {
    document.getElementById('complaint-detail-modal').style.display = 'none';
}

function updateComplaintStatus(complaintId, newStatus) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaintIndex = complaints.findIndex(c => c.id === complaintId);
    
    if (complaintIndex !== -1) {
        complaints[complaintIndex].status = newStatus;
        complaints[complaintIndex].updatedAt = new Date().toISOString();
        complaints[complaintIndex].updatedBy = currentOfficial.email;
        
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        alert(`Complaint ${complaintId} marked as ${newStatus}`);
        closeComplaintDetailModal();
        displayOfficialComplaints();
    displayOfficialDocuments();
    }
}

function verifyComplaint(complaintId) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaintIndex = complaints.findIndex(c => c.id === complaintId);
    
    if (complaintIndex !== -1) {
        complaints[complaintIndex].status = 'Verified';
        complaints[complaintIndex].verifiedAt = new Date().toISOString();
        complaints[complaintIndex].verifiedBy = currentOfficial.email;
        
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        alert(`Complaint ${complaintId} has been verified`);
        closeComplaintDetailModal();
        displayOfficialComplaints();
    displayOfficialDocuments();
    }
}

function viewOfficialDocument(docId) {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const doc = documents.find(d => d.id === docId);
    
    if (doc) {
        if (doc.fileType.startsWith('image/')) {
            const newWindow = window.open();
            newWindow.document.write(`<html><head><title>${doc.name}</title></head><body><img src="${doc.fileData}" style="max-width: 100%;" /></body></html>`);
        } else if (doc.fileType === 'application/pdf') {
            const newWindow = window.open();
            newWindow.document.write(`<html><head><title>${doc.name}</title></head><body><iframe src="${doc.fileData}" width="100%" height="100%" style="border:none;"></iframe></body></html>`);
        }
    }
}

window.addEventListener('storage', function(e) {
    if (e.key === 'complaints' && currentUser) {
        if (document.getElementById('complaints-screen').classList.contains('active')) {
            displayUserComplaints();
        }
    } else if (e.key === 'complaints' && currentOfficial) {
        if (document.getElementById('official-dashboard-screen').classList.contains('active')) {
            displayOfficialComplaints();
    displayOfficialDocuments();
        }
    } else if (e.key === 'documents' && currentUser) {
        if (document.getElementById('documents-screen').classList.contains('active')) {
            displayUserDocuments();
        }
    }
});

function displayOfficialDocuments() {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const officialDocsList = document.getElementById('official-documents-list');
    
    if (documents.length === 0) {
        officialDocsList.innerHTML = '<p style="text-align: center; color: #666;">No documents in system</p>';
        return;
    }
    
    officialDocsList.innerHTML = documents.map(doc => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.phone === doc.userId);
        const userName = user ? user.email.split('@')[0] : 'Unknown User';
        
        return `
            <div class="document-item">
                <div class="document-item-header">
                    <h4>${sanitizeHTML(doc.name)}</h4>
                    <span class="document-type-badge">${sanitizeHTML(doc.type)}</span>
                </div>
                <p><strong>User:</strong> ${sanitizeHTML(userName)} (${sanitizeHTML(doc.userId)})</p>
                <p><strong>File:</strong> ${sanitizeHTML(doc.fileName)}</p>
                <p><strong>Uploaded:</strong> ${new Date(doc.uploadedAt).toLocaleString()}</p>
                <div class="document-actions">
                    <button class="btn-secondary" onclick=\"viewDocument('${sanitizeHTML(doc.id)}')\">View</button>
                    <button class="btn-secondary" onclick=\"downloadDocument('${sanitizeHTML(doc.id)}')\">Download</button>
                </div>
            </div>
        `;
    }).join('');
}

function safeGetDocuments() {
    try {
        const data = localStorage.getItem('documents');
        if (!data) return [];
        const documents = JSON.parse(data);
        return Array.isArray(documents) ? documents : [];
    } catch (e) {
        console.error('Error reading documents from localStorage:', e);
        return [];
    }
}

function safeGetComplaints() {
    try {
        const data = localStorage.getItem('complaints');
        if (!data) return [];
        const complaints = JSON.parse(data);
        return Array.isArray(complaints) ? complaints : [];
    } catch (e) {
        console.error('Error reading complaints from localStorage:', e);
        return [];
    }
}


function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        try {
            const documents = safeGetDocuments();
            const updatedDocuments = documents.filter(d => d.id !== docId);
            localStorage.setItem('documents', JSON.stringify(updatedDocuments));
            
            if (currentUser) {
                displayUserDocuments();
                if (typeof displayDashboardSummary === 'function') {
                    displayDashboardSummary();
                }
            }
            
            if (currentOfficial && typeof displayOfficialDocuments === 'function') {
                displayOfficialDocuments();
            }
            
            alert('Document deleted successfully!');
        } catch (e) {
            console.error('Error deleting document:', e);
            alert('Error deleting document. Please try again.');
        }
    }
}

function getCurrentUserId() {
    if (currentUser) return currentUser.phone;
    if (currentOfficial) return 'official_' + currentOfficial.email;
    return null;
}

function createNotification(type, title, message, userId, data = {}) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    const notification = {
        id: 'N' + Date.now(),
        type: type,
        title: title,
        message: message,
        userId: userId,
        data: data,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    const currentId = getCurrentUserId();
    if (currentId && currentId === userId) {
        showNotificationPopup(notification);
        speakNotification(notification);
    }
    
    updateNotificationBadge();
    return notification;
}

function getUserNotifications(userId, unreadOnly = false) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    let userNotifications = notifications.filter(n => n.userId === userId);
    
    if (unreadOnly) {
        userNotifications = userNotifications.filter(n => !n.read);
    }
    
    return userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function markNotificationAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
        notifications[index].read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateNotificationBadge();
    }
}

function deleteNotification(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const unreadNotifications = getUserNotifications(userId, true);
    
    const userBadge = document.getElementById('notification-badge');
    const officialBadge = document.getElementById('notification-badge-official');
    const badge = currentUser ? userBadge : officialBadge;
    
    if (badge) {
        badge.textContent = unreadNotifications.length;
        badge.style.display = unreadNotifications.length > 0 ? 'inline-block' : 'none';
    }
}

function speakNotification(notification) {
    const voicePreference = localStorage.getItem('voicePreference');
    if (voicePreference === 'yes') {
        const message = `${notification.title}. ${notification.message}`;
        speak(message);
    }
}

function showNotificationPopup(notification) {
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.innerHTML = `
        <div class="notification-popup-content">
            <div class="notification-popup-header">
                <strong>${sanitizeHTML(notification.title)}</strong>
                <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <p>${sanitizeHTML(notification.message)}</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}

function toggleNotificationCenter() {
    const center = document.getElementById('notification-center');
    if (center.classList.contains('open')) {
        center.classList.remove('open');
    } else {
        center.classList.add('open');
        displayNotifications();
    }
}

function displayNotifications() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const notifications = getUserNotifications(userId);
    const container = document.getElementById('notifications-list');
    
    if (notifications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No notifications</p>';
        return;
    }
    
    container.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="handleNotificationClick('${n.id}')">
            <div class="notification-icon">${getNotificationIcon(n.type)}</div>
            <div class="notification-content">
                <h5>${sanitizeHTML(n.title)}</h5>
                <p>${sanitizeHTML(n.message)}</p>
                <small>${getTimeAgo(n.createdAt)}</small>
            </div>
            <button class="notification-delete" onclick="event.stopPropagation(); deleteNotificationAndRefresh('${n.id}')">×</button>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        'school_attendance': '🎓',
        'vaccination': '💉',
        'bill_payment': '💰',
        'complaint_update': '📝',
        'general': '🔔'
    };
    return icons[type] || icons['general'];
}

function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function handleNotificationClick(notificationId) {
    markNotificationAsRead(notificationId);
    displayNotifications();
}

function deleteNotificationAndRefresh(notificationId) {
    deleteNotification(notificationId);
    displayNotifications();
}

function checkSchoolAttendanceReminders() {
    if (!currentUser) return;
    
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const userChildren = children.filter(c => c.userId === currentUser.phone);
    
    userChildren.forEach(child => {
        if (!child.school) return;
        
        const today = new Date().toDateString();
        const hasAttendanceToday = child.attendance?.some(d => new Date(d).toDateString() === today);
        
        if (!hasAttendanceToday) {
            const now = new Date();
            const hour = now.getHours();
            
            if (hour >= 7 && hour < 9) {
                const existingReminder = getUserNotifications(currentUser.phone)
                    .find(n => n.type === 'school_attendance' && 
                               n.data.childId === child.id &&
                               new Date(n.createdAt).toDateString() === today);
                
                if (!existingReminder) {
                    createNotification(
                        'school_attendance',
                        'School Attendance Reminder',
                        `Don't forget to mark attendance for ${child.name} at ${child.school}`,
                        currentUser.phone,
                        { childId: child.id, childName: child.name, school: child.school }
                    );
                }
            }
        }
    });
}

function checkVaccinationReminders() {
    if (!currentUser) return;
    
    const children = JSON.parse(localStorage.getItem('children') || '[]');
    const userChildren = children.filter(c => c.userId === currentUser.phone);
    
    userChildren.forEach(child => {
        child.vaccinations?.forEach(vacc => {
            const dueDate = new Date(vacc.dueDate);
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0 || diffDays === 1 || diffDays === 3 || diffDays === 7) {
                const todayStr = today.toDateString();
                const existingReminder = getUserNotifications(currentUser.phone)
                    .find(n => n.type === 'vaccination' && 
                               n.data.vaccineId === vacc.id &&
                               new Date(n.createdAt).toDateString() === todayStr);
                
                if (!existingReminder && vacc.status !== 'Completed') {
                    const message = diffDays === 0 
                        ? `${child.name}'s ${vacc.name} vaccination is due today!`
                        : diffDays === 1
                        ? `${child.name}'s ${vacc.name} vaccination is due tomorrow`
                        : `${child.name}'s ${vacc.name} vaccination is due in ${diffDays} days`;
                    
                    createNotification(
                        'vaccination',
                        'Vaccination Reminder',
                        message,
                        currentUser.phone,
                        { childId: child.id, childName: child.name, vaccineId: vacc.id, vaccineName: vacc.name, dueDate: vacc.dueDate }
                    );
                }
            }
        });
    });
}

function checkBillPaymentReminders() {
    if (!currentUser) return;
    
    const bills = JSON.parse(localStorage.getItem('billReminders') || '[]');
    const userBills = bills.filter(b => b.userId === currentUser.phone);
    
    userBills.forEach(bill => {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays <= 3) {
            const todayStr = today.toDateString();
            const existingReminder = getUserNotifications(currentUser.phone)
                .find(n => n.type === 'bill_payment' && 
                           n.data.billId === bill.id &&
                           new Date(n.createdAt).toDateString() === todayStr);
            
            if (!existingReminder && bill.status !== 'Paid') {
                const message = diffDays === 0
                    ? `Your ${bill.type} bill is due today! Amount: ₹${bill.amount}`
                    : `Your ${bill.type} bill is due in ${diffDays} day${diffDays > 1 ? 's' : ''}. Amount: ₹${bill.amount}`;
                
                createNotification(
                    'bill_payment',
                    'Bill Payment Reminder',
                    message,
                    currentUser.phone,
                    { billId: bill.id, billType: bill.type, amount: bill.amount, dueDate: bill.dueDate }
                );
            }
        }
    });
}

function checkComplaintStatusChanges() {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const lastCheck = localStorage.getItem('lastComplaintCheck') || '{}';
    const lastCheckData = JSON.parse(lastCheck);
    
    complaints.forEach(complaint => {
        const previousStatus = lastCheckData[complaint.id];
        
        if (previousStatus && previousStatus !== complaint.status) {
            const existingNotification = getUserNotifications(complaint.userId)
                .find(n => n.type === 'complaint_update' && 
                           n.data.complaintId === complaint.id &&
                           n.data.newStatus === complaint.status);
            
            if (!existingNotification) {
                createNotification(
                    'complaint_update',
                    'Complaint Status Updated',
                    `Your complaint ${complaint.id} status changed from "${previousStatus}" to "${complaint.status}"`,
                    complaint.userId,
                    { complaintId: complaint.id, oldStatus: previousStatus, newStatus: complaint.status, department: complaint.department }
                );
            }
        }
        
        lastCheckData[complaint.id] = complaint.status;
    });
    
    localStorage.setItem('lastComplaintCheck', JSON.stringify(lastCheckData));
}

function initializeComplaintStatusTracking() {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const lastCheckData = {};
    
    complaints.forEach(complaint => {
        lastCheckData[complaint.id] = complaint.status;
    });
    
    localStorage.setItem('lastComplaintCheck', JSON.stringify(lastCheckData));
}

function runAllNotificationChecks() {
    if (currentUser) {
        checkSchoolAttendanceReminders();
        checkVaccinationReminders();
        checkBillPaymentReminders();
        checkComplaintStatusChanges();
        updateNotificationBadge();
    }
}

function initializeNotificationSystem() {
    if (!localStorage.getItem('lastComplaintCheck')) {
        initializeComplaintStatusTracking();
    }
    
    runAllNotificationChecks();
    
    setInterval(runAllNotificationChecks, 60000);
    
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 9) {
        setTimeout(checkSchoolAttendanceReminders, 5000);
    }
}

window.addEventListener('load', function() {
    if (currentUser || currentOfficial) {
        initializeNotificationSystem();
    }
});

function saveBillReminder(billType, amount, dueDate) {
    if (!currentUser) return;
    
    const bills = JSON.parse(localStorage.getItem('billReminders') || '[]');
    
    const bill = {
        id: 'BR' + Date.now(),
        userId: currentUser.phone,
        type: billType,
        amount: amount,
        dueDate: dueDate,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    bills.push(bill);
    localStorage.setItem('billReminders', JSON.stringify(bills));
    
    checkBillPaymentReminders();
    return bill;
}

function markBillAsPaid(billId) {
    const bills = JSON.parse(localStorage.getItem('billReminders') || '[]');
    const index = bills.findIndex(b => b.id === billId);
    
    if (index !== -1) {
        bills[index].status = 'Paid';
        bills[index].paidAt = new Date().toISOString();
        localStorage.setItem('billReminders', JSON.stringify(bills));
    }
}

const originalShowUserDashboard = showUserDashboard;
showUserDashboard = function() {
    originalShowUserDashboard();
    initializeNotificationSystem();
    updateNotificationBadge();
};


function createComplaintNotificationForOfficial(complaintId, userId, oldStatus, newStatus, department) {
    const officials = JSON.parse(localStorage.getItem('officials') || '[]');
    const deptOfficials = officials.filter(o => o.department === department);
    
    deptOfficials.forEach(official => {
        const officialId = 'official_' + official.email;
        createNotification(
            'complaint_update',
            'Complaint Updated',
            `Complaint ${complaintId} status changed from "${oldStatus}" to "${newStatus}"`,
            officialId,
            { complaintId, oldStatus, newStatus, department, originalUserId: userId }
        );
    });
}

const originalUpdateComplaintStatus2 = updateComplaintStatus;
updateComplaintStatus = function(complaintId, newStatus) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const complaint = complaints.find(c => c.id === complaintId);
    const oldStatus = complaint ? complaint.status : null;
    
    originalUpdateComplaintStatus2(complaintId, newStatus);
    
    if (complaint) {
        setTimeout(() => {
            checkComplaintStatusChanges();
            createComplaintNotificationForOfficial(complaintId, complaint.userId, oldStatus, newStatus, complaint.department);
        }, 500);
    }
};

const originalShowOfficialDashboard = showOfficialDashboard;
showOfficialDashboard = function() {
    originalShowOfficialDashboard();
    initializeNotificationSystem();
    updateNotificationBadge();
};
