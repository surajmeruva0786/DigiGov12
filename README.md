# Government Service Portal

## Overview

A client-side Government Service Portal built as part of the Digital India Initiative. This application provides citizens with access to government schemes, complaint filing, and other civic services. The portal features dual login systems for both citizens and government officials, with state-based service filtering and voice recognition capabilities.

The application is built entirely with vanilla JavaScript, HTML, and CSS, using browser localStorage for data persistence. It's designed as a progressive web application with a mobile-first responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single Page Application (SPA) Pattern**
- Screen-based navigation system using CSS class toggling
- Multiple view screens managed through a central `showScreen()` function
- Active screen controlled via `.active` class on screen containers
- Mobile-first responsive design with maximum width constraint (480px)

**State Management**
- Client-side state stored in global variables (`currentUser`, `currentOfficial`)
- User session data persisted in browser localStorage
- No external state management libraries - vanilla JavaScript only

**UI Component Structure**
- Modular screen-based layout (home, login, registration, dashboard, etc.)
- Color-coded service blocks for visual categorization (Purple for schemes, Pink for complaints, Blue for children services, Green for bill payments, Orange for documents)
- Form-based input collection with client-side validation
- Dynamic family member management with DOM manipulation

### Authentication & Authorization

**Dual Authentication System**
- Separate login flows for citizens and government officials
- Phone number-based user identification (10-digit validation)
- Password-based authentication stored in localStorage
- User registration with Aadhaar number collection for state detection

**State Detection Logic**
- Aadhaar number first digit maps to user's state
- State mapping used for filtering region-specific government schemes
- Supports 8 states: Delhi, Maharashtra, Karnataka, Tamil Nadu, Gujarat, West Bengal, Rajasthan, Uttar Pradesh

### Data Architecture

**Client-Side Storage (localStorage)**
- All data persisted in browser localStorage API
- No server-side database
- Data structure includes user profiles, family members, schemes, and complaints
- Data keys organized by entity type (users, officials, schemes, complaints)

**Voice Recognition Integration**
- Browser-native Web Speech API implementation
- Voice setup screen for accessibility features
- No external voice service dependencies

### Design Patterns

**Screen Navigation Pattern**
- Centralized navigation control through named screen functions
- Each screen has dedicated show function (e.g., `showUserLogin()`, `showOfficialRegister()`)
- Back navigation implemented with onclick handlers
- URL hash-based routing not implemented - relies on DOM manipulation

**Progressive Enhancement**
- Core functionality works without JavaScript (forms submit)
- Enhanced UX with JavaScript interactions
- Responsive design using CSS clamp() for fluid typography
- Gradient-based visual hierarchy for improved accessibility

## External Dependencies

### Browser APIs
- **localStorage API**: Primary data persistence layer for user data, schemes, and complaints
- **Web Speech API**: Voice recognition and accessibility features
- **DOM API**: Dynamic content rendering and screen transitions
- **Form Validation API**: Built-in HTML5 form validation

### No External Services
- No backend server or API endpoints
- No third-party authentication providers
- No external databases (PostgreSQL, MongoDB, etc.)
- No JavaScript frameworks or libraries (React, Vue, Angular)
- No CSS frameworks (Bootstrap, Tailwind)
- No build tools or bundlers required

### Future Integration Points
The architecture is designed to easily integrate:
- Backend API for centralized data storage
- Government scheme databases
- Payment gateway integration for bill payments
- Document verification services
- SMS/OTP services for phone verification
- Database systems (application currently ready to integrate with Drizzle ORM if needed)
