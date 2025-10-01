let voiceSettings = {
    enabled: false,
    ttsEnabled: true,
    sttEnabled: true
};

let voiceRecognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;

function initVoiceSystem() {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
        try {
            voiceSettings = JSON.parse(saved);
        } catch (e) {
            voiceSettings = { enabled: false, ttsEnabled: true, sttEnabled: true };
        }
    }
    
    if (voiceSettings.enabled) {
        startContinuousListening();
    }
}

function saveVoiceSettings() {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
}

function speak(text, callback) {
    if (!voiceSettings.enabled || !voiceSettings.ttsEnabled) {
        if (callback) callback();
        return;
    }
    
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    if (callback) {
        utterance.onend = callback;
    }
    
    synthesis.speak(utterance);
}

function toggleVoice(enable) {
    voiceSettings.enabled = enable;
    saveVoiceSettings();
    
    if (enable) {
        speak("Voice assistance enabled");
        startContinuousListening();
    } else {
        speak("Voice assistance disabled");
        stopListening();
    }
    
    updateVoiceUI();
}

function updateVoiceUI() {
    const voiceToggle = document.getElementById('voice-toggle');
    const voiceStatus = document.getElementById('voice-status');
    const listeningIndicator = document.getElementById('listening-indicator');
    
    if (voiceToggle) {
        voiceToggle.textContent = voiceSettings.enabled ? '🔊 Voice On' : '🔇 Voice Off';
        voiceToggle.className = voiceSettings.enabled ? 'voice-toggle-btn active' : 'voice-toggle-btn';
    }
    
    if (voiceStatus) {
        voiceStatus.textContent = voiceSettings.enabled ? 'Voice assistance is active' : 'Voice assistance is off';
    }
    
    if (listeningIndicator) {
        listeningIndicator.style.display = isListening && voiceSettings.enabled ? 'flex' : 'none';
    }
}

function startContinuousListening() {
    if (!voiceSettings.enabled || !voiceSettings.sttEnabled) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Voice recognition not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition = new SpeechRecognition();
    voiceRecognition.lang = 'en-IN';
    voiceRecognition.continuous = true;
    voiceRecognition.interimResults = false;
    
    voiceRecognition.onstart = function() {
        isListening = true;
        updateVoiceUI();
    };
    
    voiceRecognition.onresult = function(event) {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        
        showVoiceCommand(command);
        handleVoiceCommand(command);
    };
    
    voiceRecognition.onerror = function(event) {
        if (event.error === 'no-speech') {
            return;
        }
        console.log('Voice recognition error:', event.error);
    };
    
    voiceRecognition.onend = function() {
        isListening = false;
        updateVoiceUI();
        
        if (voiceSettings.enabled && voiceSettings.sttEnabled) {
            setTimeout(() => {
                try {
                    voiceRecognition.start();
                } catch (e) {
                    console.log('Restart failed:', e);
                }
            }, 1000);
        }
    };
    
    try {
        voiceRecognition.start();
    } catch (e) {
        console.log('Failed to start recognition:', e);
    }
}

function stopListening() {
    if (voiceRecognition) {
        try {
            voiceRecognition.stop();
            voiceRecognition = null;
        } catch (e) {
            console.log('Stop error:', e);
        }
    }
    isListening = false;
    updateVoiceUI();
}

function handleVoiceCommand(command) {
    const commandMap = {
        'schemes': showGovernmentSchemes,
        'scheme': showGovernmentSchemes,
        'government schemes': showGovernmentSchemes,
        'complaints': showComplaints,
        'complaint': showComplaints,
        'file complaint': showComplaints,
        'children': showChildren,
        'child': showChildren,
        'bill payments': showBillPayments,
        'bills': showBillPayments,
        'bill payment': showBillPayments,
        'pay bill': showBillPayments,
        'documents': showDocuments,
        'document': showDocuments,
        'dashboard': () => {
            if (currentUser) showUserDashboard();
            else if (currentOfficial) showOfficialDashboard();
        },
        'home': () => {
            if (currentUser) showUserDashboard();
            else if (currentOfficial) showOfficialDashboard();
        },
        'logout': logout,
        'log out': logout,
        'sign out': logout,
        'analytics': showUserAnalytics,
        'help': showVoiceHelp,
        'commands': showVoiceHelp
    };
    
    for (const [key, action] of Object.entries(commandMap)) {
        if (command.includes(key)) {
            speak(`Opening ${key}`);
            action();
            return;
        }
    }
}

function showVoiceCommand(command) {
    const indicator = document.getElementById('voice-command-display');
    if (indicator) {
        indicator.textContent = `"${command}"`;
        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
}

function showVoiceHelp() {
    const helpModal = document.getElementById('voice-help-modal');
    if (helpModal) {
        helpModal.style.display = 'flex';
        speak("Here are the available voice commands");
    }
}

function closeVoiceHelp() {
    const helpModal = document.getElementById('voice-help-modal');
    if (helpModal) {
        helpModal.style.display = 'none';
    }
}

function announceLogin(userType) {
    if (userType === 'user') {
        speak(`Login successful. Welcome to your dashboard.`);
    } else {
        speak(`Official login successful. Welcome to the admin dashboard.`);
    }
}

function announceRegistration() {
    speak("Registration successful! Please login to continue.");
}

function announceNavigation(destination) {
    const messages = {
        'schemes': 'Opening government schemes section',
        'complaints': 'Opening complaints section',
        'children': 'Opening children management section',
        'billPayments': 'Opening bill payments section',
        'documents': 'Opening documents section',
        'dashboard': 'Returning to dashboard',
        'analytics': 'Opening analytics dashboard'
    };
    
    speak(messages[destination] || `Navigating to ${destination}`);
}

function announceSchemeApplication(schemeName) {
    speak(`Applying for ${schemeName} scheme`);
}

function announceComplaintFiled(complaintId) {
    speak(`Complaint filed successfully. Your complaint ID is ${complaintId}`);
}

function announceDocumentUpload(docType) {
    speak(`${docType} uploaded successfully`);
}

function announceBillPayment(billType, amount) {
    speak(`Proceeding to pay ${billType} bill of rupees ${amount}`);
}

function announceChildAdded(childName) {
    speak(`${childName} has been added to your children list`);
}

function announceError(message) {
    speak(`Error: ${message}`);
}

initVoiceSystem();
