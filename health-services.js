function showHealthServices() {
    showScreen('health-services-screen');
    loadHealthRecords();
}

function showBloodDonorForm() {
    showScreen('blood-donor-form-screen');
}

function showOrganDonorForm() {
    showScreen('organ-donor-form-screen');
}

function showBloodRequestForm() {
    showScreen('blood-request-form-screen');
}

function showOrganRequestForm() {
    showScreen('organ-request-form-screen');
}

function showHealthTab(tab) {
    document.querySelectorAll('.health-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.health-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.health-tab-btn')).find(
        btn => btn.textContent.toLowerCase().includes(tab)
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    document.getElementById('health-tab-' + tab).classList.add('active');
    
    loadHealthRecords();
}

document.getElementById('blood-donor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donorData = {
        id: 'BD' + Date.now(),
        userId: currentUser.phone,
        type: 'blood',
        name: document.getElementById('blood-donor-name').value,
        bloodGroup: document.getElementById('blood-donor-group').value,
        age: document.getElementById('blood-donor-age').value,
        contact: document.getElementById('blood-donor-contact').value,
        location: document.getElementById('blood-donor-location').value,
        availability: document.getElementById('blood-donor-availability').value,
        medicalHistory: document.getElementById('blood-donor-medical').value,
        registeredAt: new Date().toISOString(),
        status: 'Active'
    };
    
    const donors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
    donors.push(donorData);
    localStorage.setItem('bloodDonors', JSON.stringify(donors));
    
    logActivity('blood_donor_registered', {
        donorId: donorData.id,
        userId: currentUser.phone,
        bloodGroup: donorData.bloodGroup,
        location: donorData.location
    });
    
    alert('Blood donor registration successful! Thank you for your noble contribution.');
    document.getElementById('blood-donor-form').reset();
    showHealthServices();
});

document.getElementById('organ-donor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donorData = {
        id: 'OD' + Date.now(),
        userId: currentUser.phone,
        type: 'organ',
        name: document.getElementById('organ-donor-name').value,
        organType: document.getElementById('organ-donor-type').value,
        age: document.getElementById('organ-donor-age').value,
        contact: document.getElementById('organ-donor-contact').value,
        location: document.getElementById('organ-donor-location').value,
        medicalDetails: document.getElementById('organ-donor-medical').value,
        consent: document.getElementById('organ-donor-consent').checked,
        registeredAt: new Date().toISOString(),
        status: 'Active'
    };
    
    const donors = JSON.parse(localStorage.getItem('organDonors') || '[]');
    donors.push(donorData);
    localStorage.setItem('organDonors', JSON.stringify(donors));
    
    logActivity('organ_donor_registered', {
        donorId: donorData.id,
        userId: currentUser.phone,
        organType: donorData.organType,
        location: donorData.location
    });
    
    alert('Organ donor registration successful! Thank you for your selfless decision.');
    document.getElementById('organ-donor-form').reset();
    showHealthServices();
});

document.getElementById('blood-request-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requestData = {
        id: 'BR' + Date.now(),
        userId: currentUser.phone,
        type: 'blood',
        patientName: document.getElementById('blood-request-patient').value,
        bloodGroup: document.getElementById('blood-request-group').value,
        unitsRequired: document.getElementById('blood-request-units').value,
        urgency: document.getElementById('blood-request-urgency').value,
        hospital: document.getElementById('blood-request-hospital').value,
        hospitalAddress: document.getElementById('blood-request-address').value,
        contact: document.getElementById('blood-request-contact').value,
        additionalInfo: document.getElementById('blood-request-info').value,
        requestedAt: new Date().toISOString(),
        status: 'Pending'
    };
    
    const requests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    requests.push(requestData);
    localStorage.setItem('bloodRequests', JSON.stringify(requests));
    
    logActivity('blood_requested', {
        requestId: requestData.id,
        userId: currentUser.phone,
        bloodGroup: requestData.bloodGroup,
        urgency: requestData.urgency,
        hospital: requestData.hospital
    });
    
    alert('Blood request submitted successfully! Request ID: ' + requestData.id);
    document.getElementById('blood-request-form').reset();
    showHealthServices();
});

document.getElementById('organ-request-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const requestData = {
        id: 'OR' + Date.now(),
        userId: currentUser.phone,
        type: 'organ',
        patientName: document.getElementById('organ-request-patient').value,
        organType: document.getElementById('organ-request-type').value,
        patientAge: document.getElementById('organ-request-age').value,
        urgency: document.getElementById('organ-request-urgency').value,
        hospital: document.getElementById('organ-request-hospital').value,
        hospitalAddress: document.getElementById('organ-request-address').value,
        contact: document.getElementById('organ-request-contact').value,
        medicalDetails: document.getElementById('organ-request-medical').value,
        requestedAt: new Date().toISOString(),
        status: 'Pending'
    };
    
    const requests = JSON.parse(localStorage.getItem('organRequests') || '[]');
    requests.push(requestData);
    localStorage.setItem('organRequests', JSON.stringify(requests));
    
    logActivity('organ_requested', {
        requestId: requestData.id,
        userId: currentUser.phone,
        organType: requestData.organType,
        urgency: requestData.urgency,
        hospital: requestData.hospital
    });
    
    alert('Organ request submitted successfully! Request ID: ' + requestData.id);
    document.getElementById('organ-request-form').reset();
    showHealthServices();
});

function loadHealthRecords() {
    const bloodDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
    const organDonors = JSON.parse(localStorage.getItem('organDonors') || '[]');
    const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    const organRequests = JSON.parse(localStorage.getItem('organRequests') || '[]');
    
    const userBloodDonors = bloodDonors.filter(d => d.userId === currentUser.phone);
    const userOrganDonors = organDonors.filter(d => d.userId === currentUser.phone);
    const userBloodRequests = bloodRequests.filter(r => r.userId === currentUser.phone);
    const userOrganRequests = organRequests.filter(r => r.userId === currentUser.phone);
    
    const donationsDisplay = document.getElementById('my-donations-display');
    const requestsDisplay = document.getElementById('my-requests-display');
    
    if (userBloodDonors.length === 0 && userOrganDonors.length === 0) {
        donationsDisplay.innerHTML = '<p class="no-data-message">No donations registered yet</p>';
    } else {
        let html = '';
        
        if (userBloodDonors.length > 0) {
            html += '<h4 class="records-subtitle">🩸 Blood Donations</h4>';
            userBloodDonors.forEach(donor => {
                html += `
                    <div class="health-record-card">
                        <div class="record-header">
                            <strong>Blood Donor ID: ${sanitizeHTML(donor.id)}</strong>
                            <span class="status-badge status-active">${sanitizeHTML(donor.status)}</span>
                        </div>
                        <div class="record-details">
                            <p><strong>Name:</strong> ${sanitizeHTML(donor.name)}</p>
                            <p><strong>Blood Group:</strong> ${sanitizeHTML(donor.bloodGroup)}</p>
                            <p><strong>Location:</strong> ${sanitizeHTML(donor.location)}</p>
                            <p><strong>Availability:</strong> ${sanitizeHTML(donor.availability)}</p>
                            <p><strong>Registered:</strong> ${new Date(donor.registeredAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        if (userOrganDonors.length > 0) {
            html += '<h4 class="records-subtitle">🫀 Organ Donations</h4>';
            userOrganDonors.forEach(donor => {
                html += `
                    <div class="health-record-card">
                        <div class="record-header">
                            <strong>Organ Donor ID: ${sanitizeHTML(donor.id)}</strong>
                            <span class="status-badge status-active">${sanitizeHTML(donor.status)}</span>
                        </div>
                        <div class="record-details">
                            <p><strong>Name:</strong> ${sanitizeHTML(donor.name)}</p>
                            <p><strong>Organ Type:</strong> ${sanitizeHTML(donor.organType)}</p>
                            <p><strong>Location:</strong> ${sanitizeHTML(donor.location)}</p>
                            <p><strong>Registered:</strong> ${new Date(donor.registeredAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        donationsDisplay.innerHTML = html;
    }
    
    if (userBloodRequests.length === 0 && userOrganRequests.length === 0) {
        requestsDisplay.innerHTML = '<p class="no-data-message">No requests submitted yet</p>';
    } else {
        let html = '';
        
        if (userBloodRequests.length > 0) {
            html += '<h4 class="records-subtitle">🩸 Blood Requests</h4>';
            userBloodRequests.forEach(request => {
                html += `
                    <div class="health-record-card">
                        <div class="record-header">
                            <strong>Request ID: ${sanitizeHTML(request.id)}</strong>
                            <span class="status-badge status-pending">${sanitizeHTML(request.status)}</span>
                        </div>
                        <div class="record-details">
                            <p><strong>Patient:</strong> ${sanitizeHTML(request.patientName)}</p>
                            <p><strong>Blood Group:</strong> ${sanitizeHTML(request.bloodGroup)}</p>
                            <p><strong>Units Required:</strong> ${sanitizeHTML(request.unitsRequired)}</p>
                            <p><strong>Urgency:</strong> ${sanitizeHTML(request.urgency)}</p>
                            <p><strong>Hospital:</strong> ${sanitizeHTML(request.hospital)}</p>
                            <p><strong>Requested:</strong> ${new Date(request.requestedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        if (userOrganRequests.length > 0) {
            html += '<h4 class="records-subtitle">🫀 Organ Requests</h4>';
            userOrganRequests.forEach(request => {
                html += `
                    <div class="health-record-card">
                        <div class="record-header">
                            <strong>Request ID: ${sanitizeHTML(request.id)}</strong>
                            <span class="status-badge status-pending">${sanitizeHTML(request.status)}</span>
                        </div>
                        <div class="record-details">
                            <p><strong>Patient:</strong> ${sanitizeHTML(request.patientName)}</p>
                            <p><strong>Organ Type:</strong> ${sanitizeHTML(request.organType)}</p>
                            <p><strong>Urgency:</strong> ${sanitizeHTML(request.urgency)}</p>
                            <p><strong>Hospital:</strong> ${sanitizeHTML(request.hospital)}</p>
                            <p><strong>Requested:</strong> ${new Date(request.requestedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        requestsDisplay.innerHTML = html;
    }
}

function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function displayAllHealthData() {
    const bloodDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
    const organDonors = JSON.parse(localStorage.getItem('organDonors') || '[]');
    const bloodRequests = JSON.parse(localStorage.getItem('bloodRequests') || '[]');
    const organRequests = JSON.parse(localStorage.getItem('organRequests') || '[]');
    
    const container = document.getElementById('official-tab-health');
    if (!container) return;
    
    let html = '<div class="official-health-data">';
    
    html += `
        <div class="health-stats">
            <div class="stat-card">
                <h4>🩸 Blood Donors</h4>
                <p class="stat-number">${bloodDonors.length}</p>
            </div>
            <div class="stat-card">
                <h4>🫀 Organ Donors</h4>
                <p class="stat-number">${organDonors.length}</p>
            </div>
            <div class="stat-card">
                <h4>🩸 Blood Requests</h4>
                <p class="stat-number">${bloodRequests.length}</p>
            </div>
            <div class="stat-card">
                <h4>🫀 Organ Requests</h4>
                <p class="stat-number">${organRequests.length}</p>
            </div>
        </div>
    `;
    
    html += '<h3>Blood Donors</h3>';
    if (bloodDonors.length > 0) {
        html += '<div class="data-table">';
        bloodDonors.forEach(donor => {
            html += `
                <div class="table-row">
                    <div class="row-data">
                        <strong>${sanitizeHTML(donor.id)}</strong> - ${sanitizeHTML(donor.name)} 
                        (${sanitizeHTML(donor.bloodGroup)}) - ${sanitizeHTML(donor.location)}
                        <span class="row-date">${new Date(donor.registeredAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<p class="no-data">No blood donors registered</p>';
    }
    
    html += '<h3>Organ Donors</h3>';
    if (organDonors.length > 0) {
        html += '<div class="data-table">';
        organDonors.forEach(donor => {
            html += `
                <div class="table-row">
                    <div class="row-data">
                        <strong>${sanitizeHTML(donor.id)}</strong> - ${sanitizeHTML(donor.name)} 
                        (${sanitizeHTML(donor.organType)}) - ${sanitizeHTML(donor.location)}
                        <span class="row-date">${new Date(donor.registeredAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<p class="no-data">No organ donors registered</p>';
    }
    
    html += '<h3>Blood Requests</h3>';
    if (bloodRequests.length > 0) {
        html += '<div class="data-table">';
        bloodRequests.forEach(request => {
            html += `
                <div class="table-row">
                    <div class="row-data">
                        <strong>${sanitizeHTML(request.id)}</strong> - Patient: ${sanitizeHTML(request.patientName)} 
                        (${sanitizeHTML(request.bloodGroup)}, ${sanitizeHTML(request.urgency)}) - ${sanitizeHTML(request.hospital)}
                        <span class="row-date">${new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<p class="no-data">No blood requests submitted</p>';
    }
    
    html += '<h3>Organ Requests</h3>';
    if (organRequests.length > 0) {
        html += '<div class="data-table">';
        organRequests.forEach(request => {
            html += `
                <div class="table-row">
                    <div class="row-data">
                        <strong>${sanitizeHTML(request.id)}</strong> - Patient: ${sanitizeHTML(request.patientName)} 
                        (${sanitizeHTML(request.organType)}, ${sanitizeHTML(request.urgency)}) - ${sanitizeHTML(request.hospital)}
                        <span class="row-date">${new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<p class="no-data">No organ requests submitted</p>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}
