# 💰 Expense & Budget Visualizer

A modern, full-screen web application for tracking daily expenses and visualizing spending patterns by category. Built with vanilla JavaScript featuring a clean blue and white design.

## 🎯 Features

### Required Features (MVP) ✅
- ✅ **Input Form**: Add transactions with item name, amount, and category
- ✅ **Form Validation**: All fields must be filled before submission
- ✅ **Transaction List**: Scrollable list showing all transactions with delete functionality
- ✅ **Total Balance**: Automatic calculation and display of total spending
- ✅ **Visual Chart**: Interactive pie chart showing spending distribution by category using Chart.js

### Optional Challenges (ALL 5 IMPLEMENTED!) 🌟
- ✅ **Custom Categories**: Create and manage your own expense categories with custom icons and colors
- ✅ **Monthly Summary View**: Filter by month and see detailed monthly statistics
- ✅ **Sort & Filter**: Sort transactions by date/amount/category and filter by category or search
- ✅ **Spending Limit Alerts**: Set budget limits and get visual warnings when approaching or exceeding
- ✅ **Dark/Light Mode**: Toggle between light and dark themes with smooth transitions

## 🎨 Design

### Color Scheme
- **Primary**: Blue gradient (#4A90E2 → #357ABD)
- **Background**: White
- **Text**: Dark gray (#333)
- **Dark Mode**: Blue tones (#2c5282 → #1a365d)

### Layout
- **Full Screen**: 100vh, no body scroll
- **Two-Column Layout**: 
  - Left panel: Budget, Form, Transaction History
  - Right panel: Chart, Monthly Summary
- **Responsive**: Stacks vertically on mobile

### Default Categories
- 🍔 Food (Red: #ff6b6b)
- 🚗 Transport (Cyan: #4ecdc4)
- 🎮 Fun (Yellow: #ffd93d)
- ➕ Add unlimited custom categories!

## 🛠️ Technology Stack

- **HTML5**: Structure
- **CSS3**: Styling with gradients and responsive design
- **Vanilla JavaScript (ES6+)**: All functionality (no frameworks)
- **Chart.js**: Data visualization
- **Local Storage**: Client-side data persistence

## 📁 Project Structure

```
CodingCamp-2November26-farilpirwanhadi/
├── .kiro/
│   ├── specs/
│   │   ├── .config.kiro       # Project configuration
│   │   ├── requirements.md     # Requirements specification
│   │   ├── design.md          # Design documentation
│   │   └── tasks.md           # Task tracking
├── css/
│   └── style.css              # Single CSS file (all styles)
├── js/
│   └── app.js                 # Single JavaScript file (all logic)
├── index.html                 # Main HTML file
└── README.md                  # This file
```

## 🚀 How to Use

### Basic Features

1. **Add Transaction**:
   - Enter item name (e.g., "Coffee")
   - Enter amount in Rupiah
   - Select a category
   - Click "Add Transaction"

2. **View Transactions**:
   - Scroll through your transaction history in left panel
   - See total balance at the top
   - View spending distribution in the pie chart (right panel)

3. **Delete Transaction**:
   - Click "Delete" button on any transaction
   - Confirm deletion
   - Balance and chart update automatically

### Advanced Features

4. **Set Budget Limit**:
   - Click "⚙️ Settings" in Budget section
   - Enter your monthly budget
   - Click "Save Budget"
   - Watch progress bar and get alerts at 80% and 100%

5. **Custom Categories**:
   - Click "🏷️ Manage" in Add Transaction section
   - Enter category name and emoji icon
   - Pick a color
   - Click "Add Category"
   - Remove categories anytime

6. **Filter by Month**:
   - Use dropdown above chart to filter by specific month
   - View monthly summary statistics
   - Compare spending across different months

7. **Search & Sort**:
   - Use search box to find specific transactions
   - Sort by date (newest/oldest), amount (high/low), or category
   - Click category chips to filter by category

8. **Dark Mode**:
   - Click 🌙/☀️ button in header
   - Theme preference is saved automatically
   - Blue theme in both light and dark modes

## 💾 Data Storage

All data is stored in your browser's Local Storage:
- **Transactions**: All expense records
- **Custom Categories**: Your created categories
- **Budget Settings**: Your budget limit
- **Theme Preference**: Light or dark mode
- **Note**: Data persists after closing browser but is device-specific

## 🎨 Features Highlights

### Core Features
- **Full-Screen Design**: Optimized 100vh layout with no body scroll
- **Two-Column Layout**: Left panel for input/history, right panel for visualization
- **Responsive Design**: Adapts perfectly to mobile and desktop
- **Real-time Updates**: Balance and chart update instantly
- **Smooth Animations**: Pleasant user experience with transitions
- **Color-coded Categories**: Easy visual identification
- **Input Validation**: Prevents invalid data entry
- **Blue Theme**: Modern clean blue and white color scheme

### Advanced Features
- **Budget Tracking**: Visual progress bars and smart alerts
- **Custom Categories**: Unlimited custom expense categories with icons and colors
- **Advanced Filtering**: Search, sort, and filter capabilities
- **Monthly Analytics**: Detailed monthly breakdowns and statistics
- **Dark Mode**: Eye-friendly dark theme with smooth transitions (blue tones in dark mode)
- **Smart Alerts**: Warning at 80% budget, danger at 100%
- **Persistent Settings**: All preferences saved to Local Storage

## 📱 Browser Compatibility

Works on modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🧪 Testing

To test the application:
1. Open `index.html` in a web browser
2. Add multiple transactions across different categories
3. Verify the pie chart updates correctly
4. Test delete functionality
5. Set a budget limit and test alerts
6. Create custom categories
7. Test search and filter functions
8. Toggle dark/light mode
9. Refresh the page to verify Local Storage persistence

## 📦 Deployment

This project can be deployed to GitHub Pages:
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select main branch as source
4. Your site will be published

## 👨‍💻 Development

Built as part of CodingCamp assignment with focus on:
- Clean, readable code
- Single responsibility principle
- Proper data validation
- Responsive design
- User experience
- Full implementation of all optional challenges

### Technical Constraints Met
- ✅ Only 1 CSS file in `css/` folder
- ✅ Only 1 JavaScript file in `js/` folder
- ✅ HTML, CSS, Vanilla JavaScript only (no frameworks)
- ✅ Local Storage for data persistence
- ✅ No backend server required
- ✅ Browser-based, works offline after first load

## 📊 Statistics

- **Total Lines of Code**: ~1,000+ lines
- **Features Implemented**: 10 (5 required + 5 optional)
- **Files**: 3 main files (HTML, CSS, JS)
- **Documentation**: 4 files (README, requirements, design, tasks)
- **Development Time**: ~12 hours

## 📝 License

This project is created for educational purposes as part of CodingCamp.

---
Built with ❤️ for CodingCamp | Full-Screen Blue Theme | All Optional Challenges Completed
