function initializeJobsData() {
    if (!localStorage.getItem('jobs')) {
        const defaultJobs = [
            {
                id: 'JOB001',
                title: 'Software Developer',
                type: 'Job',
                organization: 'National Informatics Centre',
                location: 'Delhi',
                qualification: 'B.Tech/BE in Computer Science',
                experience: '2-5 years',
                salary: '₹6,00,000 - ₹10,00,000 per annum',
                description: 'Develop and maintain government web applications and digital services. Work on innovative solutions for Digital India initiatives.',
                requirements: ['Strong knowledge of JavaScript, Python, or Java', 'Experience with web development frameworks', 'Understanding of database systems', 'Good problem-solving skills'],
                benefits: ['Government job security', 'Health insurance', 'Pension benefits', 'Work-life balance'],
                applicationDeadline: '2025-11-15',
                postedDate: '2025-10-01'
            },
            {
                id: 'TRN001',
                title: 'Digital Literacy Training Program',
                type: 'Training',
                organization: 'Ministry of Electronics and IT',
                location: 'Multiple Locations',
                qualification: '10th Pass',
                experience: 'No experience required',
                salary: 'Free training with certificate',
                description: 'Learn basic computer skills, internet usage, digital payments, and online government services. Get certified in digital literacy.',
                requirements: ['Basic reading and writing skills', 'Willingness to learn', 'Age 18-60 years'],
                benefits: ['Free training materials', 'Government certificate', 'Job placement assistance', 'Skill development'],
                applicationDeadline: '2025-10-30',
                postedDate: '2025-09-15'
            },
            {
                id: 'MGN001',
                title: 'MGNREGA Road Construction Work',
                type: 'MGNREGA',
                organization: 'Rural Development Department',
                location: 'Rajasthan',
                qualification: 'No formal qualification required',
                experience: 'No experience required',
                salary: '₹250 per day',
                description: 'Construction and maintenance of rural roads under MGNREGA scheme. Guaranteed 100 days of employment per year.',
                requirements: ['Physically fit for manual labor', 'Must be from rural area', 'Age 18-65 years', 'Valid job card'],
                benefits: ['Guaranteed employment', 'Fair wages', 'Social security', 'Work near home'],
                applicationDeadline: 'Ongoing',
                postedDate: '2025-09-01'
            },
            {
                id: 'JOB002',
                title: 'Data Entry Operator',
                type: 'Job',
                organization: 'Ministry of Home Affairs',
                location: 'Maharashtra',
                qualification: '12th Pass with Computer Knowledge',
                experience: '0-2 years',
                salary: '₹2,50,000 - ₹3,50,000 per annum',
                description: 'Enter and maintain accurate data in government databases. Handle confidential information with care.',
                requirements: ['Good typing speed (40+ WPM)', 'MS Office proficiency', 'Attention to detail', 'Basic English knowledge'],
                benefits: ['Government job', 'Fixed working hours', 'Medical benefits', 'Leave entitlement'],
                applicationDeadline: '2025-11-01',
                postedDate: '2025-09-20'
            },
            {
                id: 'TRN002',
                title: 'Skill India - Electrician Training',
                type: 'Training',
                organization: 'National Skill Development Corporation',
                location: 'Karnataka',
                qualification: '8th Pass',
                experience: 'No experience required',
                salary: 'Free training + ₹1,500 stipend',
                description: 'Comprehensive electrician training program covering domestic and industrial electrical work. Get certified as a skilled electrician.',
                requirements: ['Age 18-35 years', 'Basic mathematics knowledge', 'Physical fitness'],
                benefits: ['Free training', 'Monthly stipend', 'Tool kit provided', 'Job placement support'],
                applicationDeadline: '2025-10-25',
                postedDate: '2025-09-10'
            },
            {
                id: 'MGN002',
                title: 'MGNREGA Water Conservation Work',
                type: 'MGNREGA',
                organization: 'Rural Development Department',
                location: 'Uttar Pradesh',
                qualification: 'No formal qualification required',
                experience: 'No experience required',
                salary: '₹250 per day',
                description: 'Work on water conservation projects including pond digging, check dam construction, and watershed development.',
                requirements: ['Job card holder', 'Physically fit', 'Rural resident', 'Age 18-65 years'],
                benefits: ['100 days guaranteed work', 'Payment within 15 days', 'Work in local area', 'Asset creation'],
                applicationDeadline: 'Ongoing',
                postedDate: '2025-08-15'
            },
            {
                id: 'JOB003',
                title: 'Junior Accountant',
                type: 'Job',
                organization: 'Railway Finance Department',
                location: 'Gujarat',
                qualification: 'B.Com with Tally knowledge',
                experience: '1-3 years',
                salary: '₹4,00,000 - ₹6,00,000 per annum',
                description: 'Maintain financial records, prepare reports, and assist in budget preparation for railway operations.',
                requirements: ['Tally ERP 9 proficiency', 'Good knowledge of accounting', 'MS Excel skills', 'Attention to detail'],
                benefits: ['Railway employee benefits', 'Free rail passes', 'Health insurance', 'Pension scheme'],
                applicationDeadline: '2025-11-20',
                postedDate: '2025-09-25'
            },
            {
                id: 'TRN003',
                title: 'Tailoring and Fashion Design Training',
                type: 'Training',
                organization: 'Women Skill Development Program',
                location: 'Tamil Nadu',
                qualification: '5th Pass',
                experience: 'No experience required',
                salary: 'Free training + ₹2,000 stipend',
                description: 'Learn tailoring, embroidery, and basic fashion design. Start your own business or get employed in garment industry.',
                requirements: ['Women only', 'Age 18-45 years', 'Interest in tailoring'],
                benefits: ['Free sewing machine', 'Monthly stipend', 'Business setup guidance', 'Market linkage support'],
                applicationDeadline: '2025-10-20',
                postedDate: '2025-09-05'
            },
            {
                id: 'JOB004',
                title: 'Health Worker',
                type: 'Job',
                organization: 'Ministry of Health and Family Welfare',
                location: 'West Bengal',
                qualification: 'ANM/GNM Diploma',
                experience: '0-2 years',
                salary: '₹3,00,000 - ₹4,50,000 per annum',
                description: 'Provide primary healthcare services in rural areas, conduct health awareness programs, and support vaccination drives.',
                requirements: ['Valid nursing diploma', 'Good communication skills', 'Willingness to work in rural areas', 'Compassionate nature'],
                benefits: ['Government health worker benefits', 'Accommodation support', 'Medical insurance', 'Career growth'],
                applicationDeadline: '2025-11-10',
                postedDate: '2025-09-18'
            },
            {
                id: 'MGN003',
                title: 'MGNREGA Plantation Work',
                type: 'MGNREGA',
                organization: 'Forest Department',
                location: 'Delhi',
                qualification: 'No formal qualification required',
                experience: 'No experience required',
                salary: '₹300 per day',
                description: 'Tree plantation, maintenance of forest areas, and environmental conservation work under MGNREGA.',
                requirements: ['Job card required', 'Age 18-65 years', 'Interest in environmental work'],
                benefits: ['Good wages', 'Outdoor work', 'Environmental contribution', 'Flexible working days'],
                applicationDeadline: 'Ongoing',
                postedDate: '2025-09-01'
            }
        ];
        
        localStorage.setItem('jobs', JSON.stringify(defaultJobs));
    }
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function displayJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const searchQuery = document.getElementById('job-search-input')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('job-type-filter')?.value || 'all';
    const qualificationFilter = document.getElementById('job-qualification-filter')?.value.toLowerCase() || '';
    const locationFilter = document.getElementById('job-location-filter')?.value.toLowerCase() || '';
    
    let filteredJobs = jobs;
    
    if (searchQuery) {
        filteredJobs = filteredJobs.filter(job => {
            const requirementsMatch = job.requirements.some(req => 
                req.toLowerCase().includes(searchQuery)
            );
            const benefitsMatch = job.benefits.some(benefit => 
                benefit.toLowerCase().includes(searchQuery)
            );
            
            return job.title.toLowerCase().includes(searchQuery) ||
                   job.description.toLowerCase().includes(searchQuery) ||
                   job.organization.toLowerCase().includes(searchQuery) ||
                   job.qualification.toLowerCase().includes(searchQuery) ||
                   job.location.toLowerCase().includes(searchQuery) ||
                   requirementsMatch ||
                   benefitsMatch;
        });
    }
    
    if (typeFilter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.type === typeFilter);
    }
    
    if (qualificationFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.qualification.toLowerCase().includes(qualificationFilter)
        );
    }
    
    if (locationFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(locationFilter)
        );
    }
    
    const jobsContainer = document.getElementById('jobs-list');
    if (!jobsContainer) return;
    
    if (filteredJobs.length === 0) {
        jobsContainer.innerHTML = '<p class="no-data-message">No jobs found matching your criteria</p>';
        return;
    }
    
    jobsContainer.innerHTML = filteredJobs.map(job => {
        const typeClass = job.type === 'Job' ? 'job-type-job' : 
                         job.type === 'Training' ? 'job-type-training' : 'job-type-mgnrega';
        
        return `
            <div class="job-card" onclick="showJobDetails('${job.id}')">
                <div class="job-header">
                    <h3>${sanitizeHTML(job.title)}</h3>
                    <span class="job-type-badge ${typeClass}">${sanitizeHTML(job.type)}</span>
                </div>
                <div class="job-info">
                    <p><strong>🏢 Organization:</strong> ${sanitizeHTML(job.organization)}</p>
                    <p><strong>📍 Location:</strong> ${sanitizeHTML(job.location)}</p>
                    <p><strong>🎓 Qualification:</strong> ${sanitizeHTML(job.qualification)}</p>
                    <p><strong>💰 Salary:</strong> ${sanitizeHTML(job.salary)}</p>
                    <p><strong>📅 Deadline:</strong> ${sanitizeHTML(job.applicationDeadline)}</p>
                </div>
                <p class="job-description">${sanitizeHTML(job.description.substring(0, 150))}...</p>
                <button class="btn-view-details" onclick="event.stopPropagation(); showJobDetails('${job.id}')">View Details & Apply</button>
            </div>
        `;
    }).join('');
}

function filterJobs() {
    displayJobs();
}

function clearJobFilters() {
    document.getElementById('job-search-input').value = '';
    document.getElementById('job-type-filter').value = 'all';
    document.getElementById('job-qualification-filter').value = '';
    document.getElementById('job-location-filter').value = '';
    displayJobs();
}

function startJobVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice search is not supported in your browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    const voiceBtn = document.getElementById('job-voice-search-btn');
    if (voiceBtn) {
        voiceBtn.textContent = '🎤 Listening...';
        voiceBtn.style.background = '#e74c3c';
    }
    
    recognition.onresult = function(event) {
        const searchText = event.results[0][0].transcript;
        document.getElementById('job-search-input').value = searchText;
        displayJobs();
    };
    
    recognition.onerror = function(event) {
        console.error('Voice search error:', event.error);
        alert('Voice search error: ' + event.error);
    };
    
    recognition.onend = function() {
        if (voiceBtn) {
            voiceBtn.textContent = '🎤 Voice Search';
            voiceBtn.style.background = '';
        }
    };
    
    recognition.start();
}

function showJobDetails(jobId) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) return;
    
    const detailsContainer = document.getElementById('job-details-content');
    if (!detailsContainer) return;
    
    const typeClass = job.type === 'Job' ? 'job-type-job' : 
                     job.type === 'Training' ? 'job-type-training' : 'job-type-mgnrega';
    
    detailsContainer.innerHTML = `
        <div class="job-details-header">
            <h2>${sanitizeHTML(job.title)}</h2>
            <span class="job-type-badge ${typeClass}">${sanitizeHTML(job.type)}</span>
        </div>
        
        <div class="job-details-section">
            <h3>📋 Basic Information</h3>
            <p><strong>Organization:</strong> ${sanitizeHTML(job.organization)}</p>
            <p><strong>Location:</strong> ${sanitizeHTML(job.location)}</p>
            <p><strong>Qualification:</strong> ${sanitizeHTML(job.qualification)}</p>
            <p><strong>Experience:</strong> ${sanitizeHTML(job.experience)}</p>
            <p><strong>Salary/Stipend:</strong> ${sanitizeHTML(job.salary)}</p>
            <p><strong>Application Deadline:</strong> ${sanitizeHTML(job.applicationDeadline)}</p>
        </div>
        
        <div class="job-details-section">
            <h3>📝 Description</h3>
            <p>${sanitizeHTML(job.description)}</p>
        </div>
        
        <div class="job-details-section">
            <h3>✅ Requirements</h3>
            <ul>
                ${job.requirements.map(req => `<li>${sanitizeHTML(req)}</li>`).join('')}
            </ul>
        </div>
        
        <div class="job-details-section">
            <h3>🎁 Benefits</h3>
            <ul>
                ${job.benefits.map(benefit => `<li>${sanitizeHTML(benefit)}</li>`).join('')}
            </ul>
        </div>
        
        <div class="job-details-actions">
            <button class="btn-primary" onclick="showJobApplicationForm('${job.id}')">Apply Now</button>
            <button class="btn-secondary" onclick="closeJobDetails()">Close</button>
        </div>
    `;
    
    document.getElementById('job-details-modal').style.display = 'block';
}

function closeJobDetails() {
    document.getElementById('job-details-modal').style.display = 'none';
}

function showJobApplicationForm(jobId) {
    if (!currentUser) {
        alert('Please login to the main portal first to apply for jobs.');
        showUserLogin();
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) return;
    
    document.getElementById('application-job-id').value = jobId;
    document.getElementById('application-job-title').textContent = job.title;
    document.getElementById('job-application-form').reset();
    document.getElementById('resume-file-info').textContent = '';
    
    closeJobDetails();
    document.getElementById('job-application-modal').style.display = 'block';
}

function validateResumeFile() {
    const fileInput = document.getElementById('application-resume');
    const fileInfo = document.getElementById('resume-file-info');
    
    if (!fileInput.files || !fileInput.files[0]) {
        fileInfo.textContent = '';
        return;
    }
    
    const file = fileInput.files[0];
    const maxSize = 2 * 1024 * 1024;
    
    if (file.type !== 'application/pdf') {
        fileInfo.textContent = '❌ Only PDF files are allowed';
        fileInfo.style.color = '#e74c3c';
        fileInput.value = '';
        return;
    }
    
    if (file.size > maxSize) {
        fileInfo.textContent = '❌ File size exceeds 2MB limit';
        fileInfo.style.color = '#e74c3c';
        fileInput.value = '';
        return;
    }
    
    fileInfo.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    fileInfo.style.color = '#27ae60';
}

function submitJobApplication(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Please login to apply for jobs');
        showUserLogin();
        return;
    }
    
    const jobId = document.getElementById('application-job-id').value;
    const name = document.getElementById('application-name').value;
    const qualification = document.getElementById('application-qualification').value;
    const resumeFile = document.getElementById('application-resume').files[0];
    
    if (!resumeFile) {
        alert('Please upload your resume (PDF only, max 2MB)');
        return;
    }
    
    if (resumeFile.type !== 'application/pdf') {
        alert('Only PDF files are allowed for resume');
        return;
    }
    
    if (resumeFile.size > 2 * 1024 * 1024) {
        alert('Resume file size should not exceed 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const resumeData = e.target.result;
        
        const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        
        const existingApp = applications.find(app => 
            app.userId === currentUser.phone && app.jobId === jobId
        );
        
        if (existingApp) {
            alert('You have already applied for this job');
            return;
        }
        
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const job = jobs.find(j => j.id === jobId);
        
        const newApplication = {
            id: 'APP' + Date.now(),
            userId: currentUser.phone,
            jobId: jobId,
            jobTitle: job ? job.title : 'Unknown',
            jobType: job ? job.type : 'Unknown',
            name: name,
            qualification: qualification,
            resumeFileName: resumeFile.name,
            resumeData: resumeData,
            status: 'Pending',
            appliedAt: new Date().toISOString()
        };
        
        applications.push(newApplication);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        alert('Application submitted successfully! Application ID: ' + newApplication.id);
        
        document.getElementById('job-application-form').reset();
        document.getElementById('resume-file-info').textContent = '';
        cancelJobApplication();
        
        showEmploymentTab('applications');
    };
    
    reader.readAsDataURL(resumeFile);
}

function cancelJobApplication() {
    document.getElementById('job-application-modal').style.display = 'none';
    document.getElementById('job-application-form').reset();
    document.getElementById('resume-file-info').textContent = '';
}

function loadUserApplications() {
    
    const applicationsContainer = document.getElementById('user-applications-list');
    if (!applicationsContainer) return;
    
    if (!currentUser) {
        applicationsContainer.innerHTML = '<p class="no-data-message">Please login to view your applications</p>';
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const userApplications = applications.filter(app => app.userId === currentUser.phone);
    
    if (userApplications.length === 0) {
        applicationsContainer.innerHTML = '<p class="no-data-message">You haven\'t applied for any jobs yet</p>';
        return;
    }
    
    applicationsContainer.innerHTML = userApplications.reverse().map(app => {
        const statusClass = app.status === 'Accepted' ? 'status-accepted' : 
                           app.status === 'Rejected' ? 'status-rejected' : 'status-pending';
        
        const typeClass = app.jobType === 'Job' ? 'job-type-job' : 
                         app.jobType === 'Training' ? 'job-type-training' : 'job-type-mgnrega';
        
        return `
            <div class="application-card">
                <div class="application-header">
                    <h4>${sanitizeHTML(app.jobTitle)}</h4>
                    <span class="job-type-badge ${typeClass}">${sanitizeHTML(app.jobType)}</span>
                </div>
                <div class="application-info">
                    <p><strong>Application ID:</strong> ${sanitizeHTML(app.id)}</p>
                    <p><strong>Applied Date:</strong> ${new Date(app.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${sanitizeHTML(app.status)}</span></p>
                    <p><strong>Resume:</strong> ${sanitizeHTML(app.resumeFileName)}</p>
                </div>
            </div>
        `;
    }).join('');
}

function showEmploymentTab(tab) {
    document.querySelectorAll('.employment-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.employment-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.employment-tab-btn')).find(
        btn => btn.textContent.toLowerCase().includes(tab.toLowerCase())
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    document.getElementById('employment-tab-' + tab).classList.add('active');
    
    if (tab === 'jobs') {
        displayJobs();
    } else if (tab === 'applications') {
        loadUserApplications();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeJobsData();
    displayJobs();
    
    const resumeInput = document.getElementById('application-resume');
    if (resumeInput) {
        resumeInput.addEventListener('change', validateResumeFile);
    }
    
    window.onclick = function(event) {
        const detailsModal = document.getElementById('job-details-modal');
        const applicationModal = document.getElementById('job-application-modal');
        if (event.target === detailsModal) {
            closeJobDetails();
        }
        if (event.target === applicationModal) {
            cancelJobApplication();
        }
    };
});
