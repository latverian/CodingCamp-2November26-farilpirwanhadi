// ==========================================================================
// ClearSpend Visualizer — Modern Stitch Logic & State Engine
// Language: English (EN)
// Features: Full Accessibility (A11y), Edge Cases Handling, Error Safe
// ==========================================================================

// Global Application State
let transactions = [];
let customCategories = [];
let budgetLimit = 2000000; // Default: Rp 2,000,000
let currentTheme = 'light';
let chartInstance = null;

let currentFilter = {
    search: '',
    sort: 'date-desc',
    category: 'all',
    month: 'all'
};

// Built-in Default Categories
const DEFAULT_CATEGORIES = {
    'Food': { icon: '🍔', name: 'Food & Dining', color: '#FF6B6B' },
    'Transport': { icon: '🚗', name: 'Transportation', color: '#4ECDC4' },
    'Fun': { icon: '🎮', name: 'Entertainment', color: '#FFD93D' }
};

// Focus trap tracker for accessible modals
let previouslyFocusedElement = null;

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    initializeCurrentDate();
    setupEventListeners();
    setupKeyboardAccessibility();
    renderCategoryRadioInputs();
    renderCategoryPills();
    populateMonthOptions();
    updateUI();
});

function initializeCurrentDate() {
    const today = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateText = today.toLocaleDateString('en-US', options);
    const dateEl = document.getElementById('headerDateText');
    if (dateEl) dateEl.textContent = dateText;
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================

function setupEventListeners() {
    // Transaction Form Submission
    const form = document.getElementById('transactionForm');
    if (form) form.addEventListener('submit', handleAddTransaction);

    // Dark/Light Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Quick Amount Add Shortcuts
    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const addVal = parseInt(btn.getAttribute('data-add'), 10) || 0;
            const amountInput = document.getElementById('amount');
            const current = parseFloat(amountInput.value) || 0;
            
            // Edge Case: Prevent negative values from quick add
            const updated = Math.max(0, current + addVal);
            amountInput.value = updated;
            clearInputError('amount');
        });
    });

    // Real-time Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter.search = e.target.value.toLowerCase().trim();
            renderTransactionList();
        });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilter.sort = e.target.value;
            renderTransactionList();
        });
    }

    // Month Period Filter Dropdown
    const monthSelect = document.getElementById('monthFilter');
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            currentFilter.month = e.target.value;
            updateUI();
        });
    }

    // Modal Triggers
    const openBudgetBtn = document.getElementById('toggleBudgetModalBtn');
    const quickBudgetBtn = document.getElementById('quickBudgetSettingBtn');
    if (openBudgetBtn) openBudgetBtn.addEventListener('click', () => openModal('budgetModal'));
    if (quickBudgetBtn) quickBudgetBtn.addEventListener('click', () => openModal('budgetModal'));

    const openCatBtn = document.getElementById('toggleCategoryModalBtn');
    if (openCatBtn) openCatBtn.addEventListener('click', () => openModal('categoryModal'));

    // Modal Close Triggers
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            closeModal(modalId);
        });
    });

    // Modal Background Click Dismiss
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Save Budget Button in Modal
    const saveBudgetBtn = document.getElementById('saveModalBudgetBtn');
    if (saveBudgetBtn) saveBudgetBtn.addEventListener('click', handleSaveBudgetModal);

    // Add Custom Category Button in Modal
    const addCatBtn = document.getElementById('addNewCategoryBtn');
    if (addCatBtn) addCatBtn.addEventListener('click', handleAddCustomCategory);

    // Dismiss Storage Alert Toast Button
    const dismissStorageBtn = document.getElementById('dismissStorageAlertBtn');
    if (dismissStorageBtn) {
        dismissStorageBtn.addEventListener('click', () => {
            const toast = document.getElementById('storageAlertToast');
            if (toast) toast.classList.add('hidden');
        });
    }

    // Input error clearing on typing
    const itemNameInput = document.getElementById('itemName');
    if (itemNameInput) {
        itemNameInput.addEventListener('input', () => clearInputError('itemName'));
    }
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', () => clearInputError('amount'));
    }
}

// Keyboard Navigation & Modal Accessibility (A11y)
function setupKeyboardAccessibility() {
    window.addEventListener('keydown', (e) => {
        // Close open modals on Escape key
        if (e.key === 'Escape') {
            const openModalEl = document.querySelector('.modal-overlay:not(.hidden)');
            if (openModalEl) {
                closeModal(openModalEl.id);
            }
        }

        // Trap focus inside open modal
        if (e.key === 'Tab') {
            const openModalEl = document.querySelector('.modal-overlay:not(.hidden)');
            if (openModalEl) {
                trapFocus(e, openModalEl);
            }
        }
    });
}

function trapFocus(e, modalEl) {
    const focusableElements = modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// ==========================================================================
// Theme Management
// ==========================================================================

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    safeLocalStorageSet('clearspend_theme', currentTheme);
    renderChart();
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('themeToggle');
    const icon = document.querySelector('.theme-icon');
    
    if (icon) {
        icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }
    if (themeBtn) {
        themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
}

// ==========================================================================
// Category Management & Radio Controls
// ==========================================================================

function getAllCategories() {
    const custom = {};
    customCategories.forEach(cat => {
        const id = cat.id || cat.name;
        custom[id] = {
            icon: cat.icon || '🏷️',
            name: cat.name || id,
            color: cat.color || '#9b59b6'
        };
    });
    return { ...DEFAULT_CATEGORIES, ...custom };
}

function renderCategoryRadioInputs() {
    const container = document.getElementById('categoryRadioContainer');
    if (!container) return;

    const categories = getAllCategories();
    const keys = Object.keys(categories);
    const currentlyChecked = document.querySelector('input[name="category"]:checked')?.value || keys[0];

    container.innerHTML = keys.map((key) => {
        const cat = categories[key];
        const isChecked = key === currentlyChecked;
        const activeClass = isChecked ? 'active' : '';

        return `
            <label class="cat-radio-card ${activeClass}" style="--cat-color: ${cat.color}" title="${escapeHtml(cat.name)}" tabindex="0" role="radio" aria-checked="${isChecked}">
                <input type="radio" name="category" value="${escapeHtml(key)}" ${isChecked ? 'checked' : ''} tabindex="-1">
                <span aria-hidden="true">${cat.icon}</span>
                <span class="cat-radio-text">${escapeHtml(cat.name)}</span>
            </label>
        `;
    }).join('');

    // Attach click and keyboard listeners for radiogroup
    const cards = container.querySelectorAll('.cat-radio-card');
    cards.forEach((card, idx) => {
        const selectCard = () => {
            cards.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-checked', 'false');
                const radio = c.querySelector('input');
                if (radio) radio.checked = false;
            });
            card.classList.add('active');
            card.setAttribute('aria-checked', 'true');
            const radio = card.querySelector('input');
            if (radio) radio.checked = true;
            card.focus();
        };

        card.addEventListener('click', selectCard);

        card.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                selectCard();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIdx = (idx + 1) % cards.length;
                cards[nextIdx].click();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIdx = (idx - 1 + cards.length) % cards.length;
                cards[prevIdx].click();
            }
        });
    });
}

function renderCategoryPills() {
    const container = document.getElementById('categoryPillFilters');
    if (!container) return;

    const categories = getAllCategories();
    let html = `
        <button type="button" class="filter-pill ${currentFilter.category === 'all' ? 'active' : ''}" data-cat="all" aria-pressed="${currentFilter.category === 'all'}" title="Show all categories">
            All
        </button>
    `;

    Object.keys(categories).forEach(key => {
        const cat = categories[key];
        const isActive = currentFilter.category === key;
        html += `
            <button type="button" class="filter-pill ${isActive ? 'active' : ''}" data-cat="${escapeHtml(key)}" aria-pressed="${isActive}" title="${escapeHtml(cat.name)}">
                <span aria-hidden="true">${cat.icon}</span> ${escapeHtml(cat.name)}
            </button>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-pill').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentFilter.category = btn.getAttribute('data-cat');
            renderTransactionList();
            renderChart();
        });
    });
}

function handleAddCustomCategory() {
    const nameInput = document.getElementById('newCategoryName');
    const iconInput = document.getElementById('newCategoryIcon');
    const colorInput = document.getElementById('newCategoryColor');
    const errorEl = document.getElementById('categoryErrorMsg');

    const name = nameInput.value.trim();
    const icon = iconInput.value.trim() || '🏷️';
    const color = colorInput.value || '#9b59b6';

    if (errorEl) errorEl.classList.add('hidden');

    // Edge Case: Validate category name length and characters
    if (!name || name.length < 2) {
        showCategoryModalError('Category name must be at least 2 characters long.');
        nameInput.focus();
        return;
    }

    if (name.length > 30) {
        showCategoryModalError('Category name cannot exceed 30 characters.');
        nameInput.focus();
        return;
    }

    const allCats = getAllCategories();
    if (allCats[name] || Object.values(allCats).some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showCategoryModalError('A category with this name already exists.');
        nameInput.focus();
        return;
    }

    const newCat = { id: name, name, icon, color };
    customCategories.push(newCat);
    safeLocalStorageSet('clearspend_custom_categories', JSON.stringify(customCategories));

    nameInput.value = '';
    iconInput.value = '';

    renderCategoryRadioInputs();
    renderCategoryPills();
    renderModalCustomCategoryList();
    updateUI();
}

function showCategoryModalError(msg) {
    const errorEl = document.getElementById('categoryErrorMsg');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    }
}

function deleteCustomCategory(id) {
    if (confirm(`Remove custom category "${id}"? Existing transactions under this category will be preserved.`)) {
        customCategories = customCategories.filter(c => (c.id || c.name) !== id);
        safeLocalStorageSet('clearspend_custom_categories', JSON.stringify(customCategories));
        
        if (currentFilter.category === id) {
            currentFilter.category = 'all';
        }

        renderCategoryRadioInputs();
        renderCategoryPills();
        renderModalCustomCategoryList();
        updateUI();
    }
}

function renderModalCustomCategoryList() {
    const container = document.getElementById('modalCustomCategoriesList');
    if (!container) return;

    if (customCategories.length === 0) {
        container.innerHTML = '<p class="modal-desc">No custom categories added yet.</p>';
        return;
    }

    container.innerHTML = customCategories.map(cat => `
        <div class="custom-cat-row" role="listitem">
            <div class="custom-cat-info">
                <span class="custom-cat-badge" style="background: ${cat.color}" aria-hidden="true"></span>
                <span title="${escapeHtml(cat.name)}">${cat.icon} ${escapeHtml(cat.name)}</span>
            </div>
            <button type="button" class="btn-delete-item" aria-label="Delete category ${escapeHtml(cat.name)}" onclick="deleteCustomCategory('${escapeHtml(cat.id || cat.name)}')">
                <span class="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
        </div>
    `).join('');
}

// ==========================================================================
// Modal Operations (A11y Focus Management)
// ==========================================================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    previouslyFocusedElement = document.activeElement;

    if (modalId === 'budgetModal') {
        const input = document.getElementById('modalBudgetLimit');
        const err = document.getElementById('modalBudgetError');
        if (input) input.value = budgetLimit || '';
        if (err) err.classList.add('hidden');
    } else if (modalId === 'categoryModal') {
        const err = document.getElementById('categoryErrorMsg');
        if (err) err.classList.add('hidden');
        renderModalCustomCategoryList();
    }

    modal.classList.remove('hidden');
    
    // Set aria-expanded for buttons
    if (modalId === 'budgetModal') {
        const btn = document.getElementById('toggleBudgetModalBtn');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else if (modalId === 'categoryModal') {
        const btn = document.getElementById('toggleCategoryModalBtn');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    // Auto focus first interactive element in modal
    setTimeout(() => {
        const firstInput = modal.querySelector('input:not([type="hidden"]), button:not(.modal-close)');
        if (firstInput) firstInput.focus();
    }, 50);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('hidden');

    // Reset aria-expanded
    if (modalId === 'budgetModal') {
        const btn = document.getElementById('toggleBudgetModalBtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    } else if (modalId === 'categoryModal') {
        const btn = document.getElementById('toggleCategoryModalBtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    // Restore previous focus
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
    }
}

function handleSaveBudgetModal() {
    const input = document.getElementById('modalBudgetLimit');
    const err = document.getElementById('modalBudgetError');
    const val = parseFloat(input.value);

    // Edge Case: Validate budget limit
    if (isNaN(val) || val <= 0) {
        if (err) {
            err.textContent = 'Please enter a valid budget amount greater than 0.';
            err.classList.remove('hidden');
        }
        input.focus();
        return;
    }

    // Edge Case: Prevent absurdly huge overflow numbers (> 1 Trillion)
    if (val > 1000000000000000) {
        if (err) {
            err.textContent = 'Amount exceeds maximum allowable limit (1 Quadrillion).';
            err.classList.remove('hidden');
        }
        input.focus();
        return;
    }

    if (err) err.classList.add('hidden');
    budgetLimit = val;
    safeLocalStorageSet('clearspend_budget_limit', budgetLimit.toString());
    closeModal('budgetModal');
    showToastAlert('Budget limit updated successfully!');
    updateUI();
}

// ==========================================================================
// Transaction Management & Edge Case Validations
// ==========================================================================

function handleAddTransaction(e) {
    e.preventDefault();

    const nameInput = document.getElementById('itemName');
    const amountInput = document.getElementById('amount');
    const catInput = document.querySelector('input[name="category"]:checked');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = catInput ? catInput.value : 'Food';

    let hasError = false;

    // Edge Case: Validate item name
    if (!name) {
        showInputError('itemName', 'Please provide an item description.');
        hasError = true;
    } else if (name.length > 120) {
        showInputError('itemName', 'Description cannot exceed 120 characters.');
        hasError = true;
    }

    // Edge Case: Validate negative or zero amounts
    if (isNaN(amount) || amount <= 0) {
        showInputError('amount', 'Please enter a valid amount greater than 0.');
        hasError = true;
    } else if (amount > 100000000000000) {
        showInputError('amount', 'Amount exceeds the maximum supported transaction limit.');
        hasError = true;
    }

    if (hasError) return;

    // Create safe transaction object
    const newTx = {
        id: Date.now(),
        name: name,
        amount: Math.round(amount),
        category: category,
        date: new Date().toISOString()
    };

    transactions.unshift(newTx);
    saveTransactions();

    // Reset Form
    nameInput.value = '';
    amountInput.value = '';
    clearInputError('itemName');
    clearInputError('amount');

    showToastAlert('Transaction recorded successfully!');
    populateMonthOptions();
    updateUI();
}

function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(`${inputId}Error`);
    if (input) input.classList.add('input-invalid');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }
}

function clearInputError(inputId) {
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(`${inputId}Error`);
    if (input) input.classList.remove('input-invalid');
    if (errorMsg) errorMsg.classList.add('hidden');
}

function showToastAlert(message) {
    const toast = document.getElementById('formAlert');
    const toastText = document.getElementById('formAlertText');
    if (!toast) return;

    if (toastText) toastText.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

function deleteTransaction(id) {
    const target = transactions.find(t => t.id === id);
    const itemName = target ? target.name : 'this transaction';

    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        populateMonthOptions();
        updateUI();
    }
}

// ==========================================================================
// Filtering and Sorting
// ==========================================================================

function getFilteredTransactions() {
    let result = [...transactions];

    // Filter by Month
    if (currentFilter.month !== 'all') {
        result = result.filter(t => {
            const d = safeParseDate(t.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return key === currentFilter.month;
        });
    }

    // Filter by Category
    if (currentFilter.category !== 'all') {
        result = result.filter(t => t.category === currentFilter.category);
    }

    // Filter by Search Query
    if (currentFilter.search) {
        const query = currentFilter.search;
        result = result.filter(t => {
            const cat = getAllCategories()[t.category]?.name || t.category;
            return (t.name || '').toLowerCase().includes(query) || cat.toLowerCase().includes(query);
        });
    }

    // Sorting
    switch (currentFilter.sort) {
        case 'date-asc':
            result.sort((a, b) => safeParseDate(a.date) - safeParseDate(b.date));
            break;
        case 'amount-desc':
            result.sort((a, b) => b.amount - a.amount);
            break;
        case 'amount-asc':
            result.sort((a, b) => a.amount - b.amount);
            break;
        case 'category':
            result.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
            break;
        case 'date-desc':
        default:
            result.sort((a, b) => safeParseDate(b.date) - safeParseDate(a.date));
            break;
    }

    return result;
}

function populateMonthOptions() {
    const select = document.getElementById('monthFilter');
    if (!select) return;

    const currentVal = select.value;
    const monthsSet = new Set();

    transactions.forEach(t => {
        const d = safeParseDate(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(key);
    });

    const monthList = Array.from(monthsSet).sort().reverse().map(key => {
        const [year, m] = key.split('-');
        const dateObj = new Date(parseInt(year, 10), parseInt(m, 10) - 1, 1);
        const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { key, label };
    });

    select.innerHTML = '<option value="all">All Time</option>' + 
        monthList.map(m => `<option value="${m.key}">${m.label}</option>`).join('');

    if (currentVal && Array.from(select.options).some(opt => opt.value === currentVal)) {
        select.value = currentVal;
    }
}

// ==========================================================================
// UI Rendering
// ==========================================================================

function updateUI() {
    updateHeroMetrics();
    renderTransactionList();
    renderChart();
    updateBudgetWidgets();
    updateSmartTips();
}

function updateHeroMetrics() {
    const filtered = getFilteredTransactions();
    const totalSpent = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Remaining Balance with Edge Case Overflow Safety
    const remainingBalance = Math.max(0, budgetLimit - totalSpent);
    const balanceEl = document.getElementById('totalBalance');
    if (balanceEl) {
        balanceEl.textContent = formatRupiah(remainingBalance);
        balanceEl.title = `Exact remaining balance: ${formatRupiah(remainingBalance)}`;
    }

    const budgetTargetEl = document.getElementById('budgetTargetText');
    if (budgetTargetEl) {
        budgetTargetEl.textContent = `/ ${formatRupiah(budgetLimit)}`;
        budgetTargetEl.title = `Total monthly budget target: ${formatRupiah(budgetLimit)}`;
    }

    // Micro Stats
    const statExpenseEl = document.getElementById('statTotalExpense');
    if (statExpenseEl) {
        statExpenseEl.textContent = formatRupiah(totalSpent);
        statExpenseEl.title = `Total spending: ${formatRupiah(totalSpent)}`;
    }

    const statPeriodLabel = document.getElementById('statPeriodLabel');
    if (statPeriodLabel) {
        if (currentFilter.month !== 'all') {
            const [y, m] = currentFilter.month.split('-');
            const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
            statPeriodLabel.textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            statPeriodLabel.textContent = 'All Time';
        }
    }

    const statCountEl = document.getElementById('statTotalCount');
    if (statCountEl) {
        statCountEl.textContent = `${filtered.length} Transaction${filtered.length === 1 ? '' : 's'}`;
    }

    const statAvgEl = document.getElementById('statAverageExpense');
    const avg = filtered.length > 0 ? totalSpent / filtered.length : 0;
    if (statAvgEl) {
        statAvgEl.textContent = `Average: ${formatRupiah(avg)}`;
        statAvgEl.title = `Average spending per transaction: ${formatRupiah(avg)}`;
    }

    // Top Category Determination
    const catMap = {};
    filtered.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    let topCatKey = null;
    let maxAmount = 0;
    Object.keys(catMap).forEach(key => {
        if (catMap[key] > maxAmount) {
            maxAmount = catMap[key];
            topCatKey = key;
        }
    });

    const categories = getAllCategories();
    const statTopCatEl = document.getElementById('statTopCategory');
    const statTopShareEl = document.getElementById('statTopCategoryShare');

    if (topCatKey && categories[topCatKey]) {
        const topCat = categories[topCatKey];
        const share = totalSpent > 0 ? Math.round((maxAmount / totalSpent) * 100) : 0;
        if (statTopCatEl) {
            statTopCatEl.textContent = `${topCat.icon} ${topCat.name}`;
            statTopCatEl.title = topCat.name;
        }
        if (statTopShareEl) statTopShareEl.textContent = `${share}% of total spend`;
    } else {
        if (statTopCatEl) {
            statTopCatEl.textContent = '-';
            statTopCatEl.title = 'No category data';
        }
        if (statTopShareEl) statTopShareEl.textContent = '0% of total spend';
    }

    // Budget Limit Alert Banner check
    checkBudgetAlertBanner(totalSpent);
}

function checkBudgetAlertBanner(totalSpent) {
    const alertBox = document.getElementById('limitAlert');
    if (!alertBox) return;

    if (!budgetLimit || budgetLimit <= 0) {
        alertBox.classList.add('hidden');
        return;
    }

    const pct = (totalSpent / budgetLimit) * 100;
    alertBox.classList.remove('hidden', 'warning', 'danger');

    const alertText = alertBox.querySelector('.alert-text');

    if (pct >= 100) {
        alertBox.classList.add('danger');
        const over = totalSpent - budgetLimit;
        if (alertText) alertText.textContent = `Budget Exceeded by +${formatRupiah(over)}!`;
    } else if (pct >= 80) {
        alertBox.classList.add('warning');
        const remaining = budgetLimit - totalSpent;
        if (alertText) alertText.textContent = `Warning: ${formatRupiah(remaining)} left (${pct.toFixed(0)}% used)`;
    } else {
        alertBox.classList.add('hidden');
    }
}

function renderTransactionList() {
    const container = document.getElementById('transactionsList');
    const emptyState = document.getElementById('emptyState');
    if (!container) return;

    const filtered = getFilteredTransactions();
    const categories = getAllCategories();

    if (filtered.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(t => {
        const cat = categories[t.category] || { icon: '🏷️', name: t.category, color: '#9b59b6' };
        const dateStr = formatDateTime(t.date);

        return `
            <div class="transaction-item" style="--item-color: ${cat.color}" role="listitem">
                <div class="tx-left">
                    <div class="tx-icon-badge" aria-hidden="true">
                        ${cat.icon}
                    </div>
                    <div class="tx-meta">
                        <span class="tx-title" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</span>
                        <div class="tx-sub">
                            <span class="tx-cat-name" title="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</span>
                            <span aria-hidden="true">&bull;</span>
                            <time datetime="${escapeHtml(t.date)}">${dateStr}</time>
                        </div>
                    </div>
                </div>
                <div class="tx-right">
                    <span class="tx-amount" title="${formatRupiah(t.amount)}">${formatRupiah(t.amount)}</span>
                    <button type="button" class="btn-delete-item" title="Delete transaction" aria-label="Delete ${escapeHtml(t.name)} - ${formatRupiah(t.amount)}" onclick="deleteTransaction(${t.id})">
                        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Chart Visualization with Graceful CDN Failover
function renderChart() {
    const canvas = document.getElementById('expenseChart');
    const noData = document.getElementById('noDataChartMessage');
    const cdnError = document.getElementById('chartCdnErrorMessage');
    const legendContainer = document.getElementById('chartLegendList');
    if (!canvas) return;

    const filtered = getFilteredTransactions();

    // Check if Chart.js failed to load from CDN
    if (window.chartJsFailedToLoad || typeof Chart === 'undefined') {
        canvas.style.display = 'none';
        if (noData) noData.classList.add('hidden');
        if (cdnError) cdnError.classList.remove('hidden');
        renderTextLegendFallback(filtered, legendContainer);
        return;
    }

    if (cdnError) cdnError.classList.add('hidden');

    if (filtered.length === 0) {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        canvas.style.display = 'none';
        if (noData) noData.classList.remove('hidden');
        if (legendContainer) legendContainer.innerHTML = '';
        return;
    }

    canvas.style.display = 'block';
    if (noData) noData.classList.add('hidden');

    // Aggregate by category
    const catMap = {};
    let grandTotal = 0;
    filtered.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + (t.amount || 0);
        grandTotal += (t.amount || 0);
    });

    const categories = getAllCategories();
    const labels = [];
    const dataVals = [];
    const bgColors = [];

    Object.keys(catMap).forEach(key => {
        const cat = categories[key] || { icon: '🏷️', name: key, color: '#888' };
        labels.push(`${cat.icon} ${cat.name}`);
        dataVals.push(catMap[key]);
        bgColors.push(cat.color);
    });

    renderTextLegendFallback(filtered, legendContainer, grandTotal, catMap);

    // Chart.js render or update
    if (chartInstance) {
        chartInstance.destroy();
    }

    try {
        const ctx = canvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataVals,
                    backgroundColor: bgColors,
                    borderWidth: 2,
                    borderColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.parsed || 0;
                                const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : 0;
                                return ` ${formatRupiah(val)} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.warn('Chart rendering failed, falling back to accessible legend.', err);
        canvas.style.display = 'none';
        if (cdnError) cdnError.classList.remove('hidden');
    }
}

function renderTextLegendFallback(filtered, legendContainer, grandTotal, catMap) {
    if (!legendContainer) return;

    if (!catMap) {
        catMap = {};
        grandTotal = 0;
        filtered.forEach(t => {
            catMap[t.category] = (catMap[t.category] || 0) + (t.amount || 0);
            grandTotal += (t.amount || 0);
        });
    }

    const categories = getAllCategories();

    legendContainer.innerHTML = Object.keys(catMap).map(key => {
        const cat = categories[key] || { icon: '🏷️', name: key, color: '#888' };
        const amount = catMap[key];
        const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;

        return `
            <div class="legend-item" role="listitem">
                <div class="legend-left">
                    <span class="legend-dot" style="background: ${cat.color}" aria-hidden="true"></span>
                    <span class="legend-name" title="${escapeHtml(cat.name)}">${cat.icon} ${escapeHtml(cat.name)}</span>
                </div>
                <div class="legend-right">
                    <span class="legend-pct">${pct}%</span>
                    <span class="legend-sub" title="${formatRupiah(amount)}">${formatRupiah(amount)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateBudgetWidgets() {
    const filtered = getFilteredTransactions();
    const totalSpent = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

    const pct = budgetLimit > 0 ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100)) : 0;
    const bar = document.getElementById('progressBar');
    const track = document.getElementById('progressTrack');
    const pctLabel = document.getElementById('budgetPercentLabel');
    const spentText = document.getElementById('spentProgressText');
    const limitText = document.getElementById('limitProgressText');

    if (track) {
        track.setAttribute('aria-valuenow', pct.toString());
    }

    if (bar) {
        bar.style.width = `${pct}%`;
        bar.className = 'progress-fill';
        if (pct >= 100) bar.classList.add('danger');
        else if (pct >= 80) bar.classList.add('warning');
    }

    if (pctLabel) pctLabel.textContent = `${pct}%`;
    if (spentText) spentText.textContent = `Spent: ${formatRupiah(totalSpent)}`;
    if (limitText) limitText.textContent = `Limit: ${formatRupiah(budgetLimit)}`;

    // Mini Category Summary Cards
    const summaryGrid = document.getElementById('categorySummaryGrid');
    if (summaryGrid) {
        const categories = getAllCategories();
        const defaultKeys = ['Food', 'Transport', 'Fun'];

        summaryGrid.innerHTML = defaultKeys.map(key => {
            const cat = categories[key] || DEFAULT_CATEGORIES[key];
            const sum = filtered.filter(t => t.category === key).reduce((a, b) => a + (b.amount || 0), 0);

            return `
                <div class="cat-summary-box">
                    <span class="cat-sum-icon" aria-hidden="true">${cat.icon}</span>
                    <span class="cat-sum-title" title="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</span>
                    <span class="cat-sum-val" title="${formatRupiah(sum)}">${formatRupiahCompact(sum)}</span>
                </div>
            `;
        }).join('');
    }
}

function updateSmartTips() {
    const tipEl = document.getElementById('dynamicTipText');
    if (!tipEl) return;

    const filtered = getFilteredTransactions();
    const totalSpent = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

    if (filtered.length === 0) {
        tipEl.textContent = 'Consistently logging your daily transactions provides clear insights to help optimize your savings.';
        return;
    }

    if (budgetLimit > 0 && totalSpent >= budgetLimit) {
        tipEl.textContent = 'You have exceeded your monthly budget. Prioritize essential expenses and pause discretionary purchases until the next cycle.';
        return;
    }

    const catMap = {};
    filtered.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + (t.amount || 0);
    });

    if (catMap['Food'] && catMap['Food'] > totalSpent * 0.45) {
        tipEl.textContent = 'Food & Dining represents over 45% of your expenses. Preparing meals at home could help you save up to 30%.';
    } else if (catMap['Fun'] && catMap['Fun'] > totalSpent * 0.3) {
        tipEl.textContent = 'Entertainment spending is relatively high. Review recurring subscriptions and memberships for potential savings.';
    } else {
        tipEl.textContent = 'Your spending is well-balanced! Keep up this disciplined tracking routine.';
    }
}

// ==========================================================================
// Formatting & Safe Parsers
// ==========================================================================

function formatRupiah(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Edge Case: Very Large Numbers compact format
function formatRupiahCompact(amount) {
    if (!amount || isNaN(amount) || amount === 0) return 'Rp 0';
    if (amount >= 1000000000000) {
        return 'Rp ' + (amount / 1000000000000).toFixed(1).replace('.0', '') + 'T';
    }
    if (amount >= 1000000000) {
        return 'Rp ' + (amount / 1000000000).toFixed(1).replace('.0', '') + 'B';
    }
    if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + 'k';
    }
    return 'Rp ' + amount;
}

// Edge Case: Invalid Date Handling
function safeParseDate(isoString) {
    if (!isoString) return new Date();
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
        return new Date(); // Fallback safely to current date if corrupted
    }
    return d;
}

function formatDateTime(isoString) {
    const date = safeParseDate(isoString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

// ==========================================================================
// Local Storage Persistence with Quota Exceeded Safeguard
// ==========================================================================

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.error('LocalStorage quota exceeded or unavailable:', e);
        const toast = document.getElementById('storageAlertToast');
        if (toast) toast.classList.remove('hidden');
    }
}

function saveTransactions() {
    safeLocalStorageSet('clearspend_transactions', JSON.stringify(transactions));
}

function loadSavedState() {
    // Theme
    try {
        const savedTheme = localStorage.getItem('clearspend_theme');
        if (savedTheme) {
            currentTheme = savedTheme;
            applyTheme(currentTheme);
        }

        // Budget Limit
        const savedBudget = localStorage.getItem('clearspend_budget_limit');
        if (savedBudget) {
            const parsed = parseFloat(savedBudget);
            if (!isNaN(parsed) && parsed > 0) budgetLimit = parsed;
        }

        // Custom Categories
        const savedCats = localStorage.getItem('clearspend_custom_categories');
        if (savedCats) {
            customCategories = JSON.parse(savedCats) || [];
        }

        // Transactions (with legacy key fallback)
        const savedTx = localStorage.getItem('clearspend_transactions') || localStorage.getItem('transactions');
        if (savedTx) {
            const parsed = JSON.parse(savedTx);
            if (Array.isArray(parsed)) {
                // Sanitize any corrupt transaction data
                transactions = parsed.map(t => ({
                    id: t.id || Date.now(),
                    name: String(t.name || 'Expense'),
                    amount: Math.max(0, parseFloat(t.amount) || 0),
                    category: String(t.category || 'Food'),
                    date: t.date || new Date().toISOString()
                }));
            }
        } else {
            // Initial Starter Data
            transactions = [
                { id: 1, name: 'Coffee & Breakfast', amount: 25000, category: 'Food', date: new Date().toISOString() },
                { id: 2, name: 'Fuel / Gas Refill', amount: 35000, category: 'Transport', date: new Date(Date.now() - 86400000).toISOString() },
                { id: 3, name: 'Cinema Weekend Ticket', amount: 50000, category: 'Fun', date: new Date(Date.now() - 172800000).toISOString() }
            ];
            saveTransactions();
        }
    } catch (e) {
        console.error('Error reading localStorage initial state:', e);
        transactions = [];
    }
}
