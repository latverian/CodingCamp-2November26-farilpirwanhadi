# Design Document
## Expense & Budget Visualizer

---

## 1. Architecture Overview

### System Architecture
```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │       index.html              │ │
│  │   (User Interface Layer)      │ │
│  │   - Full Screen Layout        │ │
│  │   - Two Column Grid           │ │
│  └───────────────────────────────┘ │
│              ↕                      │
│  ┌───────────────────────────────┐ │
│  │       app.js                  │ │
│  │   (Application Logic Layer)   │ │
│  │   - State Management          │ │
│  │   - Event Handlers            │ │
│  │   - Filter/Sort Logic         │ │
│  └───────────────────────────────┘ │
│              ↕                      │
│  ┌───────────────────────────────┐ │
│  │    Local Storage API          │ │
│  │   (Data Persistence Layer)    │ │
│  │   - Transactions              │ │
│  │   - Custom Categories         │ │
│  │   - Budget Settings           │ │
│  │   - Theme Preference          │ │
│  └───────────────────────────────┘ │
│              ↕                      │
│  ┌───────────────────────────────┐ │
│  │       Chart.js (CDN)          │ │
│  │   (Visualization Library)     │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Visualization**: Chart.js (v4.x via CDN)
- **Storage**: Browser Local Storage API
- **Deployment**: Static hosting (GitHub Pages)

---

## 2. Component Design

### 2.1 User Interface Components

#### Full Screen Layout
```
┌─────────────────────────────────────────┐
│  💰 Expense Tracker        🌙/☀️       │
│     Total Balance: Rp 1,500,000         │
│     [Budget Alert if applicable]        │
├──────────────────┬──────────────────────┤
│   LEFT PANEL     │    RIGHT PANEL       │
│  • Budget        │  • Chart             │
│  • Form          │  • Monthly Summary   │
│  • Transactions  │                      │
│  (scrollable)    │  (scrollable)        │
└──────────────────┴──────────────────────┘
│              FOOTER                      │
└──────────────────────────────────────────┘
```

#### Header Component
```
┌────────────────────────────────┐
│ 💰 Expense Tracker      🌙     │
│    Total Balance               │
│    Rp 1,500,000                │
│ ⚠️ Budget Alert (if needed)    │
└────────────────────────────────┘
```

**Responsibilities**:
- Display application title
- Show total balance prominently
- Auto-update balance when data changes

#### Input Form Component
```
┌────────────────────────────────┐
│     Add Transaction            │
│                                │
│  Item Name: [____________]     │
│  Amount:    [____________]     │
│  Category:  [▼ Select  ]       │
│                                │
│  [ Add Transaction ]           │
└────────────────────────────────┘
```

**Responsibilities**:
- Collect transaction data
- Validate input fields
- Submit to application logic
- Reset form after submission
- Show success feedback

#### Chart Component
```
┌────────────────────────────────┐
│  Spending by Category          │
│                                │
│      ┌────────────┐            │
│      │            │            │
│      │  Pie Chart │            │
│      │            │            │
│      └────────────┘            │
│                                │
│  Legend: 🍔 Food  🚗 Transport │
└────────────────────────────────┘
```

**Responsibilities**:
- Visualize spending distribution
- Show category breakdown
- Display percentages
- Update when data changes
- Handle empty state

#### Transaction List Component
```
┌────────────────────────────────┐
│  Transaction History           │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🍔 Coffee  Food          │ │
│  │ Rp 25,000    [Delete]    │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ 🚗 Bus Fare  Transport   │ │
│  │ Rp 10,000    [Delete]    │ │
│  └──────────────────────────┘ │
│  [scrollable...]              │
└────────────────────────────────┘
```

**Responsibilities**:
- Display all transactions
- Enable deletion
- Show empty state
- Scroll when needed
- Color-code by category

---

## 3. Data Model

### Transaction Object
```javascript
{
  id: Number,           // Unique identifier (timestamp)
  name: String,         // Item name (e.g., "Coffee")
  amount: Number,       // Amount in Rupiah (e.g., 25000)
  category: String,     // Category: "Food", "Transport", or "Fun"
  date: String          // ISO date string (e.g., "2026-11-04T10:30:00.000Z")
}
```

### Application State
```javascript
{
  transactions: Array<Transaction>,  // Array of all transactions
  chart: Chart | null               // Chart.js instance
}
```

### Local Storage Structure
```javascript
// Key: "transactions"
// Value: JSON string of transactions array
localStorage.setItem("transactions", JSON.stringify([
  {
    id: 1730708400000,
    name: "Coffee",
    amount: 25000,
    category: "Food",
    date: "2026-11-04T10:30:00.000Z"
  }
]))
```

---

## 4. Application Flow

### 4.1 Application Initialization
```
Page Load
    ↓
Initialize DOM Event Listeners
    ↓
Load Data from Local Storage
    ↓
Render UI (Balance + List + Chart)
    ↓
Ready for User Input
```

### 4.2 Add Transaction Flow
```
User Fills Form
    ↓
User Clicks "Add Transaction"
    ↓
Validate Form Fields
    ↓
[Invalid] → Show Error Alert
    ↓
[Valid] → Create Transaction Object
    ↓
Add to Transactions Array
    ↓
Save to Local Storage
    ↓
Update UI Components:
  - Balance
  - Transaction List
  - Chart
    ↓
Reset Form
    ↓
Show Success Feedback
```

### 4.3 Delete Transaction Flow
```
User Clicks "Delete" Button
    ↓
Show Confirmation Dialog
    ↓
[Cancel] → No Action
    ↓
[Confirm] → Remove from Array
    ↓
Save to Local Storage
    ↓
Update UI Components:
  - Balance
  - Transaction List
  - Chart
```

---

## 5. API Design (Internal Functions)

### Core Functions

#### `initializeEventListeners()`
- **Purpose**: Set up all DOM event listeners
- **Called**: On DOMContentLoaded
- **Events**: Form submission

#### `handleFormSubmit(event)`
- **Purpose**: Process form submission
- **Input**: Form submit event
- **Validation**: Check all fields filled, amount > 0
- **Output**: Create transaction or show error

#### `deleteTransaction(id)`
- **Purpose**: Remove a transaction
- **Input**: Transaction ID (number)
- **Actions**: Filter array, save, update UI

#### `updateUI()`
- **Purpose**: Refresh all UI components
- **Calls**: updateBalance(), updateTransactionsList(), updateChart()

#### `updateBalance()`
- **Purpose**: Calculate and display total
- **Logic**: Sum all transaction amounts
- **Output**: Update #totalBalance element

#### `updateTransactionsList()`
- **Purpose**: Render transaction list
- **Logic**: Map transactions to HTML
- **Output**: Update #transactionsList element

#### `updateChart()`
- **Purpose**: Render or update pie chart
- **Logic**: Calculate category totals, create/update Chart.js
- **Output**: Update canvas element

#### `saveToLocalStorage()`
- **Purpose**: Persist transactions
- **Logic**: JSON.stringify and save to localStorage

#### `loadFromLocalStorage()`
- **Purpose**: Load saved transactions
- **Logic**: Parse JSON from localStorage

#### `formatCurrency(amount)`
- **Purpose**: Format number as Rupiah
- **Input**: Number (e.g., 25000)
- **Output**: String (e.g., "Rp 25.000")

#### `getCategoryIcon(category)`
- **Purpose**: Get emoji icon for category
- **Input**: Category string
- **Output**: Emoji string

#### `escapeHtml(text)`
- **Purpose**: Prevent XSS attacks
- **Input**: User input string
- **Output**: Sanitized string

---

## 6. UI/UX Design Decisions

### 6.1 Color Scheme
```css
Primary Gradient: #4A90E2 → #357ABD (Blue)
Background: White
Text: #333 (Dark Gray)

Category Colors:
- Food:      #ff6b6b (Red)
- Transport: #4ecdc4 (Cyan)
- Fun:       #ffd93d (Yellow)
- Custom:    User-defined colors

Dark Mode:
Primary Gradient: #2c5282 → #1a365d (Dark Blue)
Background: #1a1a2e (Dark)
Text: #e2e8f0 (Light Gray)
```

### 6.2 Typography
- **Font Family**: System fonts (-apple-system, Segoe UI, Roboto)
- **Heading**: 20-28px, bold
- **Body**: 14-16px, regular
- **Balance**: 36px, bold

### 6.3 Layout
- **Container**: Full viewport (100vw x 100vh)
- **Structure**: Two-column grid layout
  - Left Panel: Budget, Form, Transaction History
  - Right Panel: Chart, Monthly Summary
- **Padding**: 20px sections
- **Border Radius**: 12px (rounded corners)
- **Spacing**: Consistent 20px gaps
- **Responsive**: Stacks vertically on mobile (< 768px)

### 6.4 Interactions
- **Hover Effects**: Transform, color change
- **Transitions**: 0.2-0.3s ease
- **Animations**: Slide-in for new transactions
- **Feedback**: Visual confirmation on actions

### 6.5 Responsive Breakpoints
```css
Mobile:  < 768px  (full width, smaller fonts)
Desktop: ≥ 768px  (max-width container, larger fonts)
```

---

## 7. Data Validation Rules

### Form Validation
1. **Item Name**:
   - Required: Yes
   - Type: String
   - Min length: 1 character
   - Sanitized for XSS

2. **Amount**:
   - Required: Yes
   - Type: Number
   - Min value: Greater than 0
   - Step: 1000 (suggested)

3. **Category**:
   - Required: Yes
   - Type: String
   - Allowed values: "Food", "Transport", "Fun"

---

## 8. Error Handling

### User Input Errors
- **Empty fields**: Alert "Please fill in all fields!"
- **Invalid amount**: Alert "Amount must be greater than 0!"
- **Form reset**: Automatic after successful submission

### Storage Errors
- **localStorage full**: Graceful degradation (continue without persistence)
- **Parse error**: Initialize with empty array
- **Missing data**: Handle as empty state

### Chart Errors
- **No transactions**: Show "No data" message
- **Chart.js load fail**: Show message without chart

---

## 9. Performance Considerations

### Optimization Strategies
1. **Minimal DOM Updates**: Only update changed elements
2. **Event Delegation**: Single listener for delete buttons
3. **Debouncing**: None needed (instant feedback preferred)
4. **Chart Updates**: Destroy and recreate (Chart.js best practice)
5. **Local Storage**: Single read on load, single write per change

### Performance Targets
- Page load: < 2 seconds
- Form submission: < 100ms
- Chart update: < 200ms
- Transaction deletion: < 100ms

---

## 10. Security Considerations

### XSS Prevention
- Escape HTML in user-generated content (item names)
- Use `textContent` instead of `innerHTML` where possible
- Sanitize all user inputs

### Data Privacy
- All data stored locally (no external transmission)
- No analytics or tracking
- No external API calls (except Chart.js CDN)

### Input Validation
- Client-side validation for all inputs
- Type checking for amounts
- Category whitelist validation

---

## 11. Browser Compatibility

### Required Features
- ✅ ES6+ JavaScript (arrow functions, const/let, template literals)
- ✅ Local Storage API
- ✅ Canvas API (for Chart.js)
- ✅ CSS Grid/Flexbox
- ✅ CSS Animations

### Polyfills
Not required for modern browsers (Chrome, Firefox, Safari, Edge latest)

---

## 12. Deployment Architecture

```
GitHub Repository
    ↓
GitHub Pages (Static Hosting)
    ↓
CDN for Chart.js (jsdelivr)
    ↓
User's Browser
```

### Build Process
- **None required**: Vanilla JS, no compilation
- **Direct deployment**: Push HTML, CSS, JS to GitHub

---

## 13. Future Enhancement Considerations

### Phase 2 (Optional Challenges)
1. Custom categories
2. Monthly summary view
3. Sort/filter transactions
4. Spending limit alerts
5. Dark/light mode toggle

### Phase 3 (Advanced)
1. Data export (CSV/JSON)
2. Budget tracking
3. Recurring transactions
4. Multiple accounts
5. Cloud sync

---

**Document Version**: 1.0  
**Last Updated**: November 4, 2026  
**Status**: Approved
