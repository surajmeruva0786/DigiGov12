function initializePensionData() {
    if (!localStorage.getItem('pensionRequests')) {
        const sampleRequests = [
            {
                id: 'PEN' + Date.now() + '001',
                userId: 'sample_user_1',
                programType: 'Old-Age Pension',
                applicantName: 'Sample User',
                age: 65,
                gender: 'Male',
                monthlyIncome: 5000,
                familySize: 3,
                documents: [],
                status: 'Applied',
                appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                pendingDocuments: ['Income Certificate']
            },
            {
                id: 'PEN' + Date.now() + '002',
                userId: 'sample_user_2',
                programType: 'Widow Pension',
                applicantName: 'Sample Widow',
                age: 58,
                gender: 'Female',
                monthlyIncome: 3000,
                familySize: 2,
                documents: [{name: 'Death Certificate', size: 0.5, uploadedAt: new Date().toISOString()}],
                status: 'Under Review',
                appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                pendingDocuments: []
            },
            {
                id: 'PEN' + Date.now() + '003',
                userId: 'sample_user_3',
                programType: 'Disability Benefits',
                applicantName: 'Sample Disabled',
                age: 45,
                gender: 'Male',
                monthlyIncome: 0,
                familySize: 4,
                documents: [{name: 'Disability Certificate', size: 1.2, uploadedAt: new Date().toISOString()}],
                status: 'Approved',
                appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                pendingDocuments: []
            }
        ];
        
        localStorage.setItem('pensionRequests', JSON.stringify(sampleRequests));
    }
}

function showPensionRequests() {
    showScreen('pension-requests-screen');
    loadPensionRequests();
    checkPendingDocumentReminders();
}

function showPensionApplicationForm(programType) {
    const formScreen = document.getElementById('pension-application-form-screen');
    if (formScreen) {
        document.getElementById('pension-program-type-display').textContent = programType;
        document.getElementById('pension-program-type-hidden').value = programType;
        showScreen('pension-application-form-screen');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const pensionAppForm = document.getElementById('pension-application-form');
    if (pensionAppForm) {
        pensionAppForm.addEventListener('submit', handlePensionApplicationSubmit);
    }
    
    const pensionDocUpload = document.getElementById('pension-document-upload');
    if (pensionDocUpload) {
        pensionDocUpload.addEventListener('change', handlePensionDocumentValidation);
    }
    
    initializePensionData();
});

function handlePensionDocumentValidation(e) {
    const file = e.target.files[0];
    const errorDiv = document.getElementById('pension-doc-error');
    
    if (file) {
        if (file.type !== 'application/pdf') {
            errorDiv.textContent = 'Only PDF files are allowed';
            errorDiv.style.display = 'block';
            e.target.value = '';
            return false;
        }
        
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            errorDiv.textContent = 'File size must be less than 2 MB';
            errorDiv.style.display = 'block';
            e.target.value = '';
            return false;
        }
        
        errorDiv.style.display = 'none';
        return true;
    }
}

function handlePensionApplicationSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const programType = document.getElementById('pension-program-type-hidden').value;
    const applicantName = document.getElementById('pension-applicant-name').value;
    const age = document.getElementById('pension-age').value;
    const gender = document.getElementById('pension-gender').value;
    const phone = document.getElementById('pension-phone').value;
    const address = document.getElementById('pension-address').value;
    const monthlyIncome = document.getElementById('pension-income').value;
    const familySize = document.getElementById('pension-family-size').value;
    
    const documentFile = document.getElementById('pension-document-upload').files[0];
    
    const requests = JSON.parse(localStorage.getItem('pensionRequests') || '[]');
    
    const newRequest = {
        id: 'PEN' + Date.now(),
        userId: currentUser.phone,
        programType: programType,
        applicantName: applicantName,
        age: parseInt(age),
        gender: gender,
        phone: phone,
        address: address,
        monthlyIncome: parseFloat(monthlyIncome),
        familySize: parseInt(familySize),
        documents: [],
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        pendingDocuments: []
    };
    
    if (documentFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newRequest.documents.push({
                name: documentFile.name,
                size: (documentFile.size / (1024 * 1024)).toFixed(2),
                content: event.target.result,
                uploadedAt: new Date().toISOString()
            });
            
            requests.push(newRequest);
            localStorage.setItem('pensionRequests', JSON.stringify(requests));
            
            if (typeof logActivity === 'function') {
                logActivity('pension_application_submitted', {
                    requestId: newRequest.id,
                    userId: currentUser.phone,
                    programType: programType
                });
            }
            
            if (typeof speak === 'function' && voiceSettings && voiceSettings.enabled) {
                speak(`Application for ${programType} submitted successfully. Your request ID is ${newRequest.id}`);
            }
            
            alert(`Application submitted successfully!\nRequest ID: ${newRequest.id}`);
            document.getElementById('pension-application-form').reset();
            showPensionRequests();
        };
        reader.readAsDataURL(documentFile);
    } else {
        newRequest.pendingDocuments.push('Supporting Document');
        
        requests.push(newRequest);
        localStorage.setItem('pensionRequests', JSON.stringify(requests));
        
        if (typeof logActivity === 'function') {
            logActivity('pension_application_submitted', {
                requestId: newRequest.id,
                userId: currentUser.phone,
                programType: programType
            });
        }
        
        if (typeof speak === 'function' && voiceSettings && voiceSettings.enabled) {
            speak(`Application for ${programType} submitted successfully. Please upload supporting documents. Your request ID is ${newRequest.id}`);
        }
        
        alert(`Application submitted successfully!\nRequest ID: ${newRequest.id}\n\nPlease note: You need to upload supporting documents for your application to be processed.`);
        document.getElementById('pension-application-form').reset();
        showPensionRequests();
    }
}

function loadPensionRequests() {
    const requests = JSON.parse(localStorage.getItem('pensionRequests') || '[]');
    const userRequests = requests.filter(r => r.userId === currentUser.phone);
    
    const programsContainer = document.getElementById('pension-programs-list');
    const myRequestsContainer = document.getElementById('my-pension-requests');
    
    if (programsContainer) {
        programsContainer.innerHTML = `
            <div class="pension-program-card" onclick="showPensionApplicationForm('Housing Assistance')">
                <div class="pension-icon">🏠</div>
                <h4>Housing Assistance</h4>
                <p>Financial support for housing needs</p>
            </div>
            <div class="pension-program-card" onclick="showPensionApplicationForm('Old-Age Pension')">
                <div class="pension-icon">👴</div>
                <h4>Old-Age Pension</h4>
                <p>Monthly pension for senior citizens</p>
            </div>
            <div class="pension-program-card" onclick="showPensionApplicationForm('Widow Pension')">
                <div class="pension-icon">👩</div>
                <h4>Widow Pension</h4>
                <p>Financial support for widows</p>
            </div>
            <div class="pension-program-card" onclick="showPensionApplicationForm('Disability Benefits')">
                <div class="pension-icon">♿</div>
                <h4>Disability Benefits</h4>
                <p>Support for disabled individuals</p>
            </div>
        `;
    }
    
    if (myRequestsContainer) {
        if (userRequests.length === 0) {
            myRequestsContainer.innerHTML = '<p class="no-data-message">No pension requests yet. Apply for a program above!</p>';
        } else {
            myRequestsContainer.innerHTML = userRequests.map(request => {
                const statusClass = request.status === 'Applied' ? 'status-applied' :
                                   request.status === 'Under Review' ? 'status-under-review' :
                                   request.status === 'Approved' ? 'status-approved' : 'status-rejected';
                
                const hasPendingDocs = request.pendingDocuments && request.pendingDocuments.length > 0;
                
                return `
                    <div class="pension-request-card ${hasPendingDocs ? 'has-pending-docs' : ''}">
                        <div class="pension-request-header">
                            <div>
                                <h4>${sanitizeHTML(request.programType)}</h4>
                                <small>ID: ${sanitizeHTML(request.id)}</small>
                            </div>
                            <span class="pension-status-badge ${statusClass}">${sanitizeHTML(request.status)}</span>
                        </div>
                        <div class="pension-request-details">
                            <p><strong>Applicant:</strong> ${sanitizeHTML(request.applicantName)}</p>
                            <p><strong>Age:</strong> ${request.age} years | <strong>Gender:</strong> ${sanitizeHTML(request.gender)}</p>
                            <p><strong>Monthly Income:</strong> ₹${request.monthlyIncome.toLocaleString()}</p>
                            <p><strong>Family Size:</strong> ${request.familySize} members</p>
                            <p><strong>Applied On:</strong> ${new Date(request.appliedAt).toLocaleDateString()}</p>
                            ${request.approvedAt ? `<p><strong>Approved On:</strong> ${new Date(request.approvedAt).toLocaleDateString()}</p>` : ''}
                            ${request.rejectedAt ? `<p><strong>Rejected On:</strong> ${new Date(request.rejectedAt).toLocaleDateString()}</p>` : ''}
                        </div>
                        
                        <div class="pension-status-timeline">
                            <div class="timeline-step ${request.status === 'Applied' || request.status === 'Under Review' || request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}">
                                <div class="timeline-dot"></div>
                                <div class="timeline-label">Applied</div>
                            </div>
                            <div class="timeline-line ${request.status === 'Under Review' || request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}"></div>
                            <div class="timeline-step ${request.status === 'Under Review' || request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}">
                                <div class="timeline-dot"></div>
                                <div class="timeline-label">Under Review</div>
                            </div>
                            <div class="timeline-line ${request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}"></div>
                            <div class="timeline-step ${request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}">
                                <div class="timeline-dot"></div>
                                <div class="timeline-label">${request.status === 'Approved' ? 'Approved' : request.status === 'Rejected' ? 'Rejected' : 'Decision'}</div>
                            </div>
                        </div>
                        
                        <div class="pension-documents-section">
                            <h5>Documents:</h5>
                            ${request.documents.length === 0 ? 
                                '<p class="no-docs">No documents uploaded yet</p>' :
                                request.documents.map(doc => `
                                    <div class="doc-item">
                                        <span>📄 ${sanitizeHTML(doc.name)} (${doc.size} MB)</span>
                                        <small>Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}</small>
                                    </div>
                                `).join('')
                            }
                            ${hasPendingDocs ? `
                                <div class="pending-docs-alert">
                                    <strong>⚠️ Pending Documents:</strong>
                                    <ul>
                                        ${request.pendingDocuments.map(doc => `<li>${sanitizeHTML(doc)}</li>`).join('')}
                                    </ul>
                                    <button class="btn-upload-doc" onclick="showUploadPensionDocument('${request.id}')">Upload Documents</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function showUploadPensionDocument(requestId) {
    const uploadScreen = document.getElementById('pension-doc-upload-screen');
    if (uploadScreen) {
        document.getElementById('pension-upload-request-id').value = requestId;
        showScreen('pension-doc-upload-screen');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadDocForm = document.getElementById('pension-upload-doc-form');
    if (uploadDocForm) {
        uploadDocForm.addEventListener('submit', handleUploadPensionDocument);
    }
});

function handleUploadPensionDocument(e) {
    e.preventDefault();
    
    const requestId = document.getElementById('pension-upload-request-id').value;
    const documentFile = document.getElementById('pension-upload-doc-file').files[0];
    
    if (!documentFile) {
        alert('Please select a document to upload');
        return;
    }
    
    if (documentFile.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
    }
    
    const maxSize = 2 * 1024 * 1024;
    if (documentFile.size > maxSize) {
        alert('File size must be less than 2 MB');
        return;
    }
    
    const requests = JSON.parse(localStorage.getItem('pensionRequests') || '[]');
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) {
        alert('Request not found');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        requests[requestIndex].documents.push({
            name: documentFile.name,
            size: (documentFile.size / (1024 * 1024)).toFixed(2),
            content: event.target.result,
            uploadedAt: new Date().toISOString()
        });
        
        requests[requestIndex].pendingDocuments = [];
        
        localStorage.setItem('pensionRequests', JSON.stringify(requests));
        
        if (typeof speak === 'function' && voiceSettings && voiceSettings.enabled) {
            speak('Document uploaded successfully. Your application will be reviewed soon.');
        }
        
        alert('Document uploaded successfully!');
        document.getElementById('pension-upload-doc-form').reset();
        showPensionRequests();
    };
    
    reader.readAsDataURL(documentFile);
}

function checkPendingDocumentReminders() {
    if (!currentUser) return;
    
    const requests = JSON.parse(localStorage.getItem('pensionRequests') || '[]');
    const userRequests = requests.filter(r => r.userId === currentUser.phone);
    
    const pendingRequests = userRequests.filter(r => 
        r.pendingDocuments && r.pendingDocuments.length > 0
    );
    
    if (pendingRequests.length > 0) {
        showPensionReminder(pendingRequests);
    }
}

function showPensionReminder(pendingRequests) {
    const reminderDiv = document.getElementById('pension-reminder-notification');
    if (!reminderDiv) return;
    
    const count = pendingRequests.length;
    const totalPendingDocs = pendingRequests.reduce((sum, req) => sum + req.pendingDocuments.length, 0);
    
    reminderDiv.innerHTML = `
        <div class="pension-reminder-content">
            <div class="reminder-icon">⚠️</div>
            <div class="reminder-text">
                <strong>Pending Document Submissions</strong>
                <p>You have ${count} pension request${count > 1 ? 's' : ''} with ${totalPendingDocs} pending document${totalPendingDocs > 1 ? 's' : ''}.</p>
            </div>
            <button class="reminder-close" onclick="closePensionReminder()">✕</button>
        </div>
    `;
    reminderDiv.style.display = 'block';
    
    if (typeof speak === 'function' && voiceSettings && voiceSettings.enabled) {
        speak(`Reminder: You have ${count} pension request${count > 1 ? 's' : ''} with pending document submissions. Please upload the required documents.`);
    }
}

function closePensionReminder() {
    const reminderDiv = document.getElementById('pension-reminder-notification');
    if (reminderDiv) {
        reminderDiv.style.display = 'none';
    }
}

initializePensionData();
