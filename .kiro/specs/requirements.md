# Requirements Document
## Expense & Budget Visualizer

### Project Overview
A mobile-friendly web application that helps users track their daily spending, showing total balance, transaction history, and visual spending distribution by category.

---

## Functional Requirements

### FR-1: Transaction Input
**Priority**: High (MVP)
**Description**: Users must be able to add new expense transactions

**Acceptance Criteria**:
- Form must include three fields:
  - Item Name (text input)
  - Amount (number input, in Rupiah)
  - Category (dropdown: Food, Transport, Fun)
- All fields are required
- Form validates that all fields are filled before submission
- Amount must be a positive number
- Transaction is added to the list immediately after submission
- Form resets after successful submission

### FR-2: Transaction List Display
**Priority**: High (MVP)
**Description**: Users must be able to view all their transactions

**Acceptance Criteria**:
- Display all transactions in a scrollable list
- Each transaction shows:
  - Item name
  - Amount (formatted in Rupiah)
  - Category with icon
- List is sorted by date (newest first)
- Empty state message shown when no transactions exist
- List should be scrollable when content exceeds viewport

### FR-3: Transaction Deletion
**Priority**: High (MVP)
**Description**: Users must be able to delete individual transactions

**Acceptance Criteria**:
- Each transaction has a "Delete" button
- Confirmation dialog appears before deletion
- Transaction is removed from list immediately
- Total balance updates after deletion
- Chart updates after deletion

### FR-4: Total Balance Calculation
**Priority**: High (MVP)
**Description**: Display total spending across all transactions

**Acceptance Criteria**:
- Balance is displayed prominently at the top
- Balance is formatted in Indonesian Rupiah (Rp)
- Balance updates automatically when:
  - New transaction is added
  - Transaction is deleted
- Initial balance is Rp 0

### FR-5: Visual Chart
**Priority**: High (MVP)
**Description**: Display spending distribution by category in a pie chart

**Acceptance Criteria**:
- Pie chart shows spending breakdown by category
- Uses Chart.js library
- Each category has a distinct color:
  - Food: Red (#ff6b6b)
  - Transport: Cyan (#4ecdc4)
  - Fun: Yellow (#ffd93d)
- Chart updates automatically when transactions change
- Tooltip shows amount and percentage on hover
- Shows "No data" message when no transactions exist
- Only shows categories that have transactions

### FR-6: Data Persistence
**Priority**: High (MVP)
**Description**: Transactions must persist across browser sessions

**Acceptance Criteria**:
- All transactions saved to browser Local Storage
- Data loads automatically on page load
- Transactions persist after:
  - Browser refresh
  - Browser close/reopen
  - Device restart
- Data is stored in JSON format

---

## Non-Functional Requirements

### NFR-1: Simplicity
**Description**: Clean, minimal interface with no complex setup

**Requirements**:
- Single-page application
- No login or authentication required
- No server setup needed
- No build process required
- Can run directly from index.html

### NFR-2: Performance
**Description**: Fast and responsive user experience

**Requirements**:
- Page loads in under 2 seconds
- UI updates appear instantly (< 100ms)
- No lag when adding/deleting transactions
- Chart renders smoothly without flicker
- Form submission feedback is immediate

### NFR-3: Visual Design
**Description**: User-friendly aesthetic with clear hierarchy

**Requirements**:
- Modern, clean blue and white interface
- Full-screen layout (100vh)
- Two-column grid design for optimal space usage
- Clear visual hierarchy
- Readable typography (minimum 12px)
- Consistent blue color scheme (#4A90E2 → #357ABD)
- Smooth animations and transitions
- Color-coded categories for easy identification
- Dark mode with blue tones

### NFR-4: Responsive Design
**Description**: Must work on mobile and desktop devices

**Requirements**:
- Works on screens 320px width and above
- Touch-friendly buttons (minimum 44x44px)
- Readable on small screens
- Adapts layout for different screen sizes
- No horizontal scrolling

### NFR-5: Browser Compatibility
**Description**: Works across modern browsers

**Requirements**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- No Internet Explorer support required

---

## Technical Constraints

### TC-1: Technology Stack
**Mandatory Technologies**:
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript (ES6+)
- Chart.js for visualization
- No frameworks (React, Vue, Angular, etc.)
- No backend server

### TC-2: File Structure
**Requirements**:
- Only 1 CSS file in `css/` folder
- Only 1 JavaScript file in `js/` folder
- HTML file in root directory
- Code must be clean and readable

### TC-3: Data Storage
**Requirements**:
- Browser Local Storage API only
- All data stored client-side
- No server-side storage
- No external database

### TC-4: External Dependencies
**Allowed**:
- Chart.js (via CDN)

**Not Allowed**:
- jQuery
- Bootstrap
- Other UI frameworks
- Backend frameworks

---

## User Stories

### US-1: Add Daily Expense
**As a** user  
**I want to** quickly add my daily expenses  
**So that** I can track where my money goes

**Scenarios**:
- Add coffee purchase (Food category)
- Add bus fare (Transport category)
- Add movie ticket (Fun category)

### US-2: View Spending History
**As a** user  
**I want to** see all my past transactions  
**So that** I can review my spending habits

### US-3: Remove Wrong Entry
**As a** user  
**I want to** delete a transaction I added by mistake  
**So that** my records stay accurate

### US-4: See Total Spending
**As a** user  
**I want to** see my total spending at a glance  
**So that** I know how much I've spent overall

### US-5: Visualize Spending Pattern
**As a** user  
**I want to** see a visual breakdown of my spending by category  
**So that** I can understand where most of my money goes

---

## Out of Scope (v1)

The following features are explicitly **not included** in this version:
- Income tracking
- Budget limits or alerts
- Multiple users or accounts
- Data export/import
- Recurring transactions
- Receipt photos
- Payment methods tracking
- Currency conversion
- Cloud sync
- Mobile app (native)
- Authentication/login
- Data analytics/reports
- Search or filter functionality
- Edit transaction capability
- Custom categories (fixed to Food, Transport, Fun)
- Date range filtering
- Monthly/yearly views

---

## Success Criteria

The project is considered successful when:
1. ✅ All MVP features (FR-1 through FR-6) are implemented
2. ✅ All form validations work correctly
3. ✅ Data persists across browser sessions
4. ✅ Chart displays and updates correctly
5. ✅ Application is responsive on mobile and desktop
6. ✅ Code follows the folder structure rules
7. ✅ Application can be deployed to GitHub Pages
8. ✅ No console errors in browser
9. ✅ Application works without internet (after first load)

---

## Risks and Mitigation

### Risk 1: Local Storage Size Limit
**Impact**: Medium  
**Probability**: Low  
**Mitigation**: Local Storage has 5-10MB limit, sufficient for thousands of transactions

### Risk 2: Data Loss
**Impact**: High  
**Probability**: Low  
**Mitigation**: 
- Data persists in Local Storage
- User can manually backup by not clearing browser data
- Future: Add export feature

### Risk 3: Browser Compatibility
**Impact**: Medium  
**Probability**: Low  
**Mitigation**: Use standard APIs supported by all modern browsers

### Risk 4: Chart.js CDN Availability
**Impact**: Medium  
**Probability**: Low  
**Mitigation**: Use reliable CDN (jsdelivr), chart gracefully shows "no data" if unavailable

---

## Glossary

- **Transaction**: A single expense entry with name, amount, and category
- **Category**: Classification of expense (Food, Transport, Fun)
- **Balance**: Total sum of all transaction amounts
- **Local Storage**: Browser API for client-side data persistence
- **MVP**: Minimum Viable Product - core features required for v1

---

**Document Version**: 1.0  
**Last Updated**: November 4, 2026  
**Status**: Approved
