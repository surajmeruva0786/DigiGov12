function displayOfficialEmployment() {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    
    const container = document.getElementById('official-employment-list');
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = '<p class="no-data-message">No job listings available</p>';
        return;
    }
    
    let html = '';
    
    jobs.forEach(job => {
        const jobApplications = applications.filter(app => app.jobId === job.id);
        const typeClass = job.type === 'Job' ? 'job-type-job' : 
                         job.type === 'Training' ? 'job-type-training' : 'job-type-mgnrega';
        
        html += `
            <div class="official-employment-card">
                <div class="job-header">
                    <h4>${sanitizeHTML(job.title)}</h4>
                    <span class="job-type-badge ${typeClass}">${sanitizeHTML(job.type)}</span>
                </div>
                <div class="job-meta">
                    <p><strong>Organization:</strong> ${sanitizeHTML(job.organization)}</p>
                    <p><strong>Location:</strong> ${sanitizeHTML(job.location)}</p>
                    <p><strong>Qualification:</strong> ${sanitizeHTML(job.qualification)}</p>
                    <p><strong>Applications:</strong> ${jobApplications.length}</p>
                </div>
                <div class="applications-section">
                    <h5>Applications (${jobApplications.length})</h5>
                    ${jobApplications.length === 0 ? 
                        '<p class="no-data-message">No applications yet</p>' : 
                        jobApplications.map(app => generateApplicationCard(app, job)).join('')
                    }
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function generateApplicationCard(application, job) {
    const statusClass = application.status === 'Approved' ? 'status-approved' : 
                       application.status === 'Rejected' ? 'status-rejected' : 'status-pending';
    
    const notes = JSON.parse(localStorage.getItem('officialNotes') || '{}');
    const appNotes = notes[application.id] || [];
    
    return `
        <div class="application-card">
            <div class="application-header">
                <div>
                    <strong>${sanitizeHTML(application.applicantName)}</strong>
                    <p style="font-size: 13px; color: #666;">Phone: ${sanitizeHTML(application.phone)}</p>
                </div>
                <span class="application-status ${statusClass}">${sanitizeHTML(application.status)}</span>
            </div>
            <div class="application-details">
                <p><strong>Qualification:</strong> ${sanitizeHTML(application.qualification)}</p>
                <p><strong>Experience:</strong> ${sanitizeHTML(application.experience || 'Not specified')}</p>
                <p><strong>Applied:</strong> ${new Date(application.appliedAt).toLocaleDateString()}</p>
                ${application.resume ? `<p><strong>Resume:</strong> <a href="${sanitizeHTML(application.resume)}" target="_blank">View Resume</a></p>` : ''}
            </div>
            
            ${application.status === 'Pending' ? `
                <div class="application-actions">
                    <button class="btn-approve" onclick="approveApplication('${application.id}')">✓ Approve</button>
                    <button class="btn-reject" onclick="rejectApplication('${application.id}')">✗ Reject</button>
                </div>
            ` : ''}
            
            <div class="notes-section">
                <h6>Official Notes:</h6>
                <div class="notes-list">
                    ${appNotes.length === 0 ? '<p style="font-size: 13px; color: #999;">No notes yet</p>' : 
                      appNotes.map(note => `
                        <div class="note-item">
                            <p>${sanitizeHTML(note.text)}</p>
                            <small>By: ${sanitizeHTML(note.officialName)} on ${new Date(note.timestamp).toLocaleString()}</small>
                        </div>
                      `).join('')
                    }
                </div>
                <div class="add-note-section">
                    <input type="text" id="note-input-${application.id}" placeholder="Add a note..." class="note-input">
                    <button class="btn-add-note" onclick="addOfficialNote('${application.id}')">Add Note</button>
                </div>
            </div>
        </div>
    `;
}

function approveApplication(applicationId) {
    if (!currentOfficial) {
        alert('Please login as an official');
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const appIndex = applications.findIndex(app => app.id === applicationId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    applications[appIndex].status = 'Approved';
    applications[appIndex].approvedBy = currentOfficial.email;
    applications[appIndex].approvedAt = new Date().toISOString();
    
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    
    logActivity('application_approved', {
        applicationId: applicationId,
        officialEmail: currentOfficial.email,
        timestamp: new Date().toISOString()
    });
    
    alert('Application approved successfully!');
    displayOfficialEmployment();
}

function rejectApplication(applicationId) {
    if (!currentOfficial) {
        alert('Please login as an official');
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const appIndex = applications.findIndex(app => app.id === applicationId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    applications[appIndex].status = 'Rejected';
    applications[appIndex].rejectedBy = currentOfficial.email;
    applications[appIndex].rejectedAt = new Date().toISOString();
    
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    
    logActivity('application_rejected', {
        applicationId: applicationId,
        officialEmail: currentOfficial.email,
        timestamp: new Date().toISOString()
    });
    
    alert('Application rejected successfully!');
    displayOfficialEmployment();
}

function addOfficialNote(applicationId) {
    if (!currentOfficial) {
        alert('Please login as an official');
        return;
    }
    
    const noteInput = document.getElementById(`note-input-${applicationId}`);
    if (!noteInput) return;
    
    const noteText = noteInput.value.trim();
    if (!noteText) {
        alert('Please enter a note');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('officialNotes') || '{}');
    
    if (!notes[applicationId]) {
        notes[applicationId] = [];
    }
    
    notes[applicationId].push({
        text: noteText,
        officialName: currentOfficial.name,
        officialEmail: currentOfficial.email,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('officialNotes', JSON.stringify(notes));
    
    logActivity('official_note_added', {
        applicationId: applicationId,
        noteText: noteText,
        officialEmail: currentOfficial.email
    });
    
    noteInput.value = '';
    displayOfficialEmployment();
}

function filterOfficialApplications() {
    const typeFilter = document.getElementById('official-job-type-filter')?.value || 'all';
    const qualificationFilter = document.getElementById('official-qualification-filter')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('official-status-filter')?.value || 'all';
    
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    
    let filteredJobs = jobs;
    
    if (typeFilter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.type === typeFilter);
    }
    
    if (qualificationFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.qualification.toLowerCase().includes(qualificationFilter)
        );
    }
    
    const container = document.getElementById('official-employment-list');
    if (!container) return;
    
    if (filteredJobs.length === 0) {
        container.innerHTML = '<p class="no-data-message">No jobs match your filters</p>';
        return;
    }
    
    let html = '';
    
    filteredJobs.forEach(job => {
        let jobApplications = applications.filter(app => app.jobId === job.id);
        
        if (statusFilter !== 'all') {
            jobApplications = jobApplications.filter(app => app.status === statusFilter);
        }
        
        const typeClass = job.type === 'Job' ? 'job-type-job' : 
                         job.type === 'Training' ? 'job-type-training' : 'job-type-mgnrega';
        
        html += `
            <div class="official-employment-card">
                <div class="job-header">
                    <h4>${sanitizeHTML(job.title)}</h4>
                    <span class="job-type-badge ${typeClass}">${sanitizeHTML(job.type)}</span>
                </div>
                <div class="job-meta">
                    <p><strong>Organization:</strong> ${sanitizeHTML(job.organization)}</p>
                    <p><strong>Location:</strong> ${sanitizeHTML(job.location)}</p>
                    <p><strong>Qualification:</strong> ${sanitizeHTML(job.qualification)}</p>
                    <p><strong>Applications:</strong> ${jobApplications.length}</p>
                </div>
                <div class="applications-section">
                    <h5>Applications (${jobApplications.length})</h5>
                    ${jobApplications.length === 0 ? 
                        '<p class="no-data-message">No applications for this filter</p>' : 
                        jobApplications.map(app => generateApplicationCard(app, job)).join('')
                    }
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
