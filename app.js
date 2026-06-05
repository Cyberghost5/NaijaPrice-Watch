/* ============================================ */
/* NAIJAPRICEWATCH - APPLICATION LOGIC (app.js) */
/* ============================================ */

/* ============================================ */
/* 1. MARKET DATA - Array of objects with food prices */
/* ============================================ */

/**
 * Market data array containing current food prices across Nigerian markets.
 * Each object represents a commodity with:
 * - itemName: Name of the food item
 * - price: Current price in Nigerian Naira (₦)
 * - marketLocation: Where this price was recorded
 * - dateUpdated: When the price was last updated
 * 
 * Items reflect common staples in Nigerian households.
 */
const marketData = [
    {
        itemName: 'Bag of Rice (50kg)',
        price: 28500,
        marketLocation: 'Lekki Market, Lagos',
        dateUpdated: '2026-06-01'
    },
    {
        itemName: 'Paint Bucket of Garri (25L)',
        price: 4200,
        marketLocation: 'Idumota Market, Lagos',
        dateUpdated: '2026-06-01'
    },
    {
        itemName: '25L Vegetable Oil',
        price: 18000,
        marketLocation: 'Bodija Market, Ibadan',
        dateUpdated: '2026-05-31'
    },
    {
        itemName: 'Crate of Eggs (30 pieces)',
        price: 3600,
        marketLocation: 'Yaba Market, Lagos',
        dateUpdated: '2026-06-01'
    },
    {
        itemName: 'Bag of Beans (50kg)',
        price: 32000,
        marketLocation: 'Mile 12 Market, Lagos',
        dateUpdated: '2026-05-30'
    },
    {
        itemName: 'Tin of Tomato Paste (900g)',
        price: 2800,
        marketLocation: 'Ore Market, Ondo',
        dateUpdated: '2026-06-01'
    }
];

/* ============================================ */
/* 2. INITIALIZE TABLE WITH MARKET DATA */
/* ============================================ */

/**
 * Function: populatePriceTable()
 * 
 * This function maps through the marketData array and dynamically generates
 * HTML table rows. It uses template literals to create the row structure.
 * 
 * Called on window load to populate the price dashboard.
 */
function populatePriceTable() {
    // Get the table body element where rows will be inserted
    const tableBody = document.getElementById('tableBody');
    
    // Map through marketData array and create HTML rows
    const tableRows = marketData.map(item => {
        // Use template literal to create table row HTML
        return `
            <tr class="price-table-row">
                <td>${item.itemName}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>${item.marketLocation}</td>
                <td>${item.dateUpdated}</td>
            </tr>
        `;
    }).join(''); // Join all rows into single string
    
    // Insert generated HTML into table body
    tableBody.innerHTML = tableRows;
}

/* ============================================ */
/* 3. INITIALIZE BUDGET PLANNER ITEMS */
/* ============================================ */

/**
 * Function: populateBudgetItems()
 * 
 * Dynamically creates checkbox and quantity input controls for each market item.
 * These allow users to select items and adjust quantities for budget planning.
 */
function populateBudgetItems() {
    // Get the container where budget items will be inserted
    const itemsContainer = document.getElementById('itemsContainer');
    
    // Map through marketData to create item selection rows
    const itemsHTML = marketData.map((item, index) => {
        // Generate unique IDs for each item's checkbox and quantity input
        const checkboxId = `item-${index}`;
        const quantityId = `qty-${index}`;
        
        // Create HTML for item row with checkbox, label, price, and quantity input
        return `
            <div class="item-row">
                <!-- Checkbox for item selection -->
                <input 
                    type="checkbox" 
                    id="${checkboxId}" 
                    class="item-checkbox" 
                    data-item-index="${index}"
                    data-item-price="${item.price}"
                >
                
                <!-- Label with item name (clickable for accessibility) -->
                <label for="${checkboxId}" class="item-label">
                    ${item.itemName}
                </label>
                
                <!-- Display item price -->
                <span class="item-price">₦${item.price.toLocaleString()}</span>
                
                <!-- Quantity input (disabled until item is selected) -->
                <input 
                    type="number" 
                    id="${quantityId}" 
                    class="item-quantity" 
                    value="1" 
                    min="1" 
                    max="100"
                    disabled
                >
            </div>
        `;
    }).join('');
    
    // Insert generated HTML into items container
    itemsContainer.innerHTML = itemsHTML;
}

/* ============================================ */
/* 4. BUDGET CALCULATION AND REAL-TIME UPDATES */
/* ============================================ */

/**
 * Function: calculateBudgetTotal()
 * 
 * This function:
 * 1. Gets all selected items and their quantities
 * 2. Calculates the total cost
 * 3. Compares against the user's budget
 * 4. Updates UI with total and status message
 * 
 * Called whenever checkboxes or quantity inputs change.
 */
function calculateBudgetTotal() {
    // Get budget input value
    const maxBudgetInput = document.getElementById('maxBudget');
    const maxBudget = parseFloat(maxBudgetInput.value) || 0;
    
    // Get total cost display element
    const totalCostElement = document.getElementById('totalCost');
    
    // Get budget status message element
    const statusElement = document.getElementById('budgetStatus');
    
    // Initialize total to 0
    let totalCost = 0;
    
    // Get all checked checkboxes
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    
    // Loop through each selected item
    checkedItems.forEach(checkbox => {
        // Get the item's price from checkbox data attribute
        const itemPrice = parseFloat(checkbox.getAttribute('data-item-price'));
        
        // Get the item index to find matching quantity input
        const itemIndex = checkbox.getAttribute('data-item-index');
        const quantityInput = document.getElementById(`qty-${itemIndex}`);
        
        // Get quantity value (default to 1)
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Add to total: price × quantity
        totalCost += itemPrice * quantity;
    });
    
    // Update total cost display with formatted currency
    totalCostElement.textContent = `₦${totalCost.toLocaleString()}`;
    
    // Update budget status message based on whether total exceeds budget
    if (maxBudget === 0) {
        // No budget set yet
        statusElement.innerHTML = '<p class="status-message">Enter budget and select items to get started</p>';
        statusElement.className = 'budget-status';
    } else if (totalCost <= maxBudget) {
        // Within budget - show green success message
        statusElement.innerHTML = `<p class="status-message">✓ Safe to Shop - Remaining: ₦${(maxBudget - totalCost).toLocaleString()}</p>`;
        statusElement.className = 'budget-status status-safe';
    } else {
        // Exceeds budget - show red warning message
        const overage = totalCost - maxBudget;
        statusElement.innerHTML = `<p class="status-message">✗ Budget Exceeded - Over by ₦${overage.toLocaleString()}</p>`;
        statusElement.className = 'budget-status status-exceeded';
    }
}

/* ============================================ */
/* 5. CHECKBOX CHANGE HANDLER */
/* ============================================ */

/**
 * Function: handleItemCheckboxChange(event)
 * 
 * Event listener for checkbox changes.
 * - When checked: enables the quantity input
 * - When unchecked: disables the quantity input
 * - Triggers budget calculation on change
 * 
 * Parameters:
 * - event: The checkbox change event
 */
function handleItemCheckboxChange(event) {
    // Get the checked checkbox element
    const checkbox = event.target;
    
    // Get corresponding quantity input
    const itemIndex = checkbox.getAttribute('data-item-index');
    const quantityInput = document.getElementById(`qty-${itemIndex}`);
    
    // Enable/disable quantity input based on checkbox state
    quantityInput.disabled = !checkbox.checked;
    
    // Recalculate total whenever checkbox is toggled
    calculateBudgetTotal();
}

/* ============================================ */
/* 6. QUANTITY INPUT CHANGE HANDLER */
/* ============================================ */

/**
 * Function: handleQuantityChange(event)
 * 
 * Event listener for quantity input changes.
 * Recalculates the budget total whenever quantity is modified.
 * 
 * Parameters:
 * - event: The input change event
 */
function handleQuantityChange(event) {
    // Recalculate total when quantity changes
    calculateBudgetTotal();
}

/* ============================================ */
/* 7. BUDGET INPUT CHANGE HANDLER */
/* ============================================ */

/**
 * Function: handleBudgetInputChange(event)
 * 
 * Event listener for budget input changes.
 * Recalculates the budget status whenever the budget value changes.
 * 
 * Parameters:
 * - event: The input change event
 */
function handleBudgetInputChange(event) {
    // Recalculate total when budget changes
    calculateBudgetTotal();
}

/* ============================================ */
/* 8. FORM SUBMISSION HANDLER */
/* ============================================ */

/**
 * Function: handleFormSubmit(event)
 * 
 * Handles the form submission for "Generate Shopping List".
 * - Prevents default form behavior
 * - Collects selected items with quantities
 * - Saves to localStorage for persistence
 * - Displays shopping list in modal
 * 
 * Parameters:
 * - event: The form submit event
 */
function handleFormSubmit(event) {
    // Prevent form from reloading the page
    event.preventDefault();
    
    // Get selected items
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    
    // Check if user selected any items
    if (checkedItems.length === 0) {
        alert('Please select at least one item to generate shopping list.');
        return;
    }
    
    // Get budget value
    const maxBudget = parseFloat(document.getElementById('maxBudget').value);
    
    // Check if budget is valid
    if (maxBudget === 0) {
        alert('Please enter a budget to generate shopping list.');
        return;
    }
    
    // Build shopping list array with selected items
    const shoppingList = [];
    let totalCost = 0;
    
    checkedItems.forEach(checkbox => {
        // Get item index and price
        const itemIndex = checkbox.getAttribute('data-item-index');
        const itemPrice = parseFloat(checkbox.getAttribute('data-item-price'));
        
        // Get quantity
        const quantityInput = document.getElementById(`qty-${itemIndex}`);
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Get item name from marketData
        const item = marketData[itemIndex];
        
        // Calculate subtotal for this item
        const subtotal = itemPrice * quantity;
        totalCost += subtotal;
        
        // Add to shopping list
        shoppingList.push({
            itemName: item.itemName,
            price: itemPrice,
            quantity: quantity,
            subtotal: subtotal,
            marketLocation: item.marketLocation
        });
    });
    
    // Create shopping list object with metadata
    const shoppingListData = {
        id: Date.now(), // Unique ID using timestamp
        dateCreated: new Date().toLocaleString(),
        budget: maxBudget,
        items: shoppingList,
        totalCost: totalCost,
        remaining: maxBudget - totalCost
    };
    
    // Get existing lists from localStorage or create new array
    let savedLists = JSON.parse(localStorage.getItem('naijapricewatch_lists')) || [];
    
    // Add new list to the beginning
    savedLists.unshift(shoppingListData);
    
    // Save back to localStorage (keep last 10 lists)
    localStorage.setItem('naijapricewatch_lists', JSON.stringify(savedLists.slice(0, 10)));
    
    // Store current shopping list for PDF download
    window.currentShoppingList = shoppingListData;
    
    // Display the shopping list in modal
    displayShoppingListModal(shoppingListData);
    
    // Optional: Reset form for next list
    document.getElementById('budgetForm').reset();
    calculateBudgetTotal();
}

/* ============================================ */
/* 8B. RETRIEVE SAVED SHOPPING LISTS */
/* ============================================ */

/**
 * Function: getSavedShoppingLists()
 * 
 * Retrieves all saved shopping lists from localStorage.
 * Useful for demo and testing purposes.
 * 
 * Returns: Array of saved shopping list objects
 */
function getSavedShoppingLists() {
    const lists = JSON.parse(localStorage.getItem('naijapricewatch_lists')) || [];
    return lists;
}

/**
 * Function: viewSavedLists()
 * 
 * Displays all saved shopping lists in a readable format.
 * Can be called from browser console for demo purposes.
 */
function viewSavedLists() {
    const lists = getSavedShoppingLists();
    
    if (lists.length === 0) {
        console.log('No saved shopping lists yet.');
        return;
    }
    
    console.log(`\n=== SAVED SHOPPING LISTS (${lists.length}) ===\n`);
    
    lists.forEach((list, index) => {
        console.log(`LIST ${index + 1} - Created: ${list.dateCreated}`);
        console.log(`Budget: ₦${list.budget.toLocaleString()} | Total: ₦${list.totalCost.toLocaleString()} | Remaining: ₦${list.remaining.toLocaleString()}`);
        console.log('Items:');
        list.items.forEach(item => {
            console.log(`  • ${item.itemName} - ₦${item.price.toLocaleString()} × ${item.quantity} = ₦${item.subtotal.toLocaleString()}`);
        });
        console.log('---\n');
    });
}

/**
 * Function: clearSavedLists()
 * 
 * Clears all saved shopping lists from localStorage.
 * Can be called from browser console to reset demo data.
 */
function clearSavedLists() {
    localStorage.removeItem('naijapricewatch_lists');
    console.log('All saved shopping lists have been cleared.');
}

/* ============================================ */
/* 8C. MODAL DISPLAY FUNCTIONS */
/* ============================================ */

/**
 * Function: displayShoppingListModal(shoppingListData)
 * 
 * Displays the shopping list in a modal window.
 * Formats all items with prices, quantities, and totals.
 * 
 * Parameters:
 * - shoppingListData: Object containing list details and items
 */
function displayShoppingListModal(shoppingListData) {
    // Get the modal content container
    const modalContent = document.getElementById('shoppingListContent');
    
    // Build items table HTML
    let itemsTableHTML = `
        <table class="shopping-list-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price (₦)</th>
                    <th style="text-align: right;">Subtotal (₦)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add each item to the table
    shoppingListData.items.forEach(item => {
        itemsTableHTML += `
            <tr>
                <td>${item.itemName}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₦${item.price.toLocaleString()}</td>
                <td style="text-align: right;">₦${item.subtotal.toLocaleString()}</td>
            </tr>
        `;
    });
    
    itemsTableHTML += `
            </tbody>
        </table>
    `;
    
    // Determine budget status color
    const isWithinBudget = shoppingListData.remaining >= 0;
    const statusClass = isWithinBudget ? 'safe' : 'exceeded';
    const statusText = isWithinBudget ? '✓ Within Budget' : '✗ Budget Exceeded';
    
    // Build the complete modal content
    const modalHTML = `
        <div class="shopping-list-details">
            <!-- List metadata -->
            <div class="list-header">
                <div class="list-detail-item">
                    <span class="list-detail-label">Date Created</span>
                    <span class="list-detail-value">${shoppingListData.dateCreated}</span>
                </div>
                <div class="list-detail-item">
                    <span class="list-detail-label">Total Items</span>
                    <span class="list-detail-value">${shoppingListData.items.length}</span>
                </div>
            </div>

            <!-- Items table -->
            ${itemsTableHTML}

            <!-- Summary section -->
            <div class="list-summary">
                <div class="summary-item">
                    <div class="summary-label">Budget</div>
                    <div class="summary-value">₦${shoppingListData.budget.toLocaleString()}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Total Cost</div>
                    <div class="summary-value">₦${shoppingListData.totalCost.toLocaleString()}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">${statusText}</div>
                    <div class="summary-value ${statusClass}">₦${Math.abs(shoppingListData.remaining).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
    
    // Insert HTML into modal body
    modalContent.innerHTML = modalHTML;
    
    // Show the modal
    const modal = document.getElementById('shoppingListModal');
    modal.classList.add('show');
}

/**
 * Function: closeShoppingListModal()
 * 
 * Closes the shopping list modal.
 */
function closeShoppingListModal() {
    const modal = document.getElementById('shoppingListModal');
    modal.classList.remove('show');
}

/**
 * Function: downloadAsPDF()
 * 
 * Downloads the current shopping list as a PDF file.
 * Generates a properly formatted HTML document with inline styles for the PDF.
 */
function downloadAsPDF() {
    const list = window.currentShoppingList;
    
    if (!list) {
        alert('No shopping list to download. Please generate a list first.');
        return;
    }
    
    // Get current date for filename
    const today = new Date().toISOString().split('T')[0];
    
    // Determine budget status
    const isWithinBudget = list.remaining >= 0;
    const statusText = isWithinBudget ? '✓ Within Budget' : '✗ Budget Exceeded';
    const statusColor = isWithinBudget ? '#28a745' : '#dc3545';
    
    // Build items table rows
    let itemsTableRows = list.items.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 12px; text-align: left;">${item.itemName}</td>
            <td style="padding: 12px; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right;">₦${item.price.toLocaleString()}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">₦${item.subtotal.toLocaleString()}</td>
        </tr>
    `).join('');
    
    // Create complete PDF HTML document with inline styles
    const pdfHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>NaijaPrice Shopping List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .pdf-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .pdf-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #1a4d2e;
                    padding-bottom: 20px;
                }
                .pdf-logo {
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                .pdf-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a4d2e;
                    margin: 0;
                }
                .pdf-subtitle {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }
                .list-metadata {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 6px;
                }
                .metadata-item {
                    display: flex;
                    flex-direction: column;
                }
                .metadata-label {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .metadata-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }
                .items-section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1a4d2e;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #d4a574;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                thead {
                    background-color: #1a4d2e;
                    color: white;
                }
                th {
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                    font-size: 12px;
                }
                td {
                    padding: 12px;
                    font-size: 13px;
                }
                tbody tr:hover {
                    background-color: #f9f9f9;
                }
                .summary-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 6px;
                    margin-bottom: 30px;
                }
                .summary-item {
                    text-align: center;
                }
                .summary-label {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    font-weight: bold;
                }
                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1a4d2e;
                }
                .summary-value.safe {
                    color: #28a745;
                }
                .summary-value.exceeded {
                    color: #dc3545;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 11px;
                    color: #999;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="pdf-container">
                <!-- Header -->
                <div class="pdf-header">
                    <div class="pdf-logo">🛒</div>
                    <h1 class="pdf-title">NaijaPrice Watch</h1>
                    <p class="pdf-subtitle">Shopping List Summary</p>
                </div>

                <!-- Metadata -->
                <div class="list-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Date Created</span>
                        <span class="metadata-value">${list.dateCreated}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Total Items</span>
                        <span class="metadata-value">${list.items.length}</span>
                    </div>
                </div>

                <!-- Items Section -->
                <div class="items-section">
                    <div class="section-title">📋 Your Shopping Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Price (₦)</th>
                                <th style="text-align: right;">Subtotal (₦)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsTableRows}
                        </tbody>
                    </table>
                </div>

                <!-- Summary Section -->
                <div class="summary-section">
                    <div class="summary-item">
                        <div class="summary-label">Your Budget</div>
                        <div class="summary-value">₦${list.budget.toLocaleString()}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Cost</div>
                        <div class="summary-value">₦${list.totalCost.toLocaleString()}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">${statusText}</div>
                        <div class="summary-value ${isWithinBudget ? 'safe' : 'exceeded'}">₦${Math.abs(list.remaining).toLocaleString()}</div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>Generated by NaijaPrice Watch - Track prices. Control spending. Live smarter.</p>
                    <p>This shopping list was generated on ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Create a temporary element to hold the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = pdfHTML;
    const pdfContent = tempElement.querySelector('.pdf-container');
    
    // PDF options
    const opt = {
        margin: 10,
        filename: `NaijaPrice_ShoppingList_${today}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Generate and download PDF
    html2pdf().set(opt).from(pdfContent).save();
}

/* ============================================ */
/* 9. ATTACH EVENT LISTENERS - DELEGATION */
/* ============================================ */

/**
 * Function: attachEventListeners()
 * 
 * Attaches all necessary event listeners to form elements.
 * Uses event delegation where appropriate for efficiency.
 */
function attachEventListeners() {
    // Get form elements
    const budgetForm = document.getElementById('budgetForm');
    const maxBudgetInput = document.getElementById('maxBudget');
    const itemsContainer = document.getElementById('itemsContainer');
    const modal = document.getElementById('shoppingListModal');
    
    // Listen for budget input changes
    maxBudgetInput.addEventListener('input', handleBudgetInputChange);
    
    // Listen for form submission
    budgetForm.addEventListener('submit', handleFormSubmit);
    
    // Use event delegation for checkboxes (more efficient than individual listeners)
    itemsContainer.addEventListener('change', (event) => {
        // Check if changed element is a checkbox
        if (event.target.classList.contains('item-checkbox')) {
            handleItemCheckboxChange(event);
        }
        // Check if changed element is a quantity input
        else if (event.target.classList.contains('item-quantity')) {
            handleQuantityChange(event);
        }
    });
    
    // Close modal when clicking on the backdrop (outside the modal content)
    modal.addEventListener('click', (event) => {
        // Check if click was on the modal backdrop, not the content
        if (event.target === modal) {
            closeShoppingListModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeShoppingListModal();
        }
    });
}

/* ============================================ */
/* 10. INITIALIZATION - RUN ON WINDOW LOAD */
/* ============================================ */

/**
 * Window load event handler
 * 
 * Executed when the DOM is fully loaded and ready for manipulation.
 * Initializes the application by:
 * 1. Populating the price table with market data
 * 2. Creating budget planner item controls
 * 3. Attaching event listeners to form elements
 */
window.addEventListener('load', () => {
    // Populate the price dashboard table with market data
    populatePriceTable();
    
    // Create budget planner item selection controls
    populateBudgetItems();
    
    // Attach event listeners to all interactive elements
    attachEventListeners();
    
    // Log that app has initialized successfully (helpful for debugging)
    console.log('NaijaPrice Watch app initialized successfully!');
});

/* ============================================ */
/* DOCUMENTATION AND LEARNING NOTES */
/* ============================================ */

/**
 * KEY CONCEPTS EXPLAINED FOR JUNIOR DEVELOPERS:
 * 
 * 1. ARRAY.MAP() - Transforms array items into new values
 *    - Used to convert market data objects into HTML table rows
 *    - More functional and cleaner than using for loops
 * 
 * 2. TEMPLATE LITERALS - String interpolation with backticks
 *    - Allows ${variable} syntax for embedding values
 *    - Makes HTML generation more readable
 * 
 * 3. EVENT LISTENERS - Respond to user interactions
 *    - addEventListener() attached to elements or containers
 *    - Common events: 'click', 'change', 'input', 'submit'
 * 
 * 4. EVENT DELEGATION - Single listener on parent element
 *    - More efficient than many listeners on individual elements
 *    - Check event.target to see what triggered the event
 * 
 * 5. DOM MANIPULATION - Selecting and modifying HTML elements
 *    - document.getElementById() - select by ID
 *    - document.querySelectorAll() - select by CSS selector
 *    - element.innerHTML - insert HTML content
 * 
 * 6. DATA ATTRIBUTES - Store custom data on HTML elements
 *    - data-* attributes in HTML: <input data-item-price="5000">
 *    - Access in JS: element.getAttribute('data-item-price')
 *    - Useful for passing data to event handlers
 * 
 * 7. EVENT OBJECT - Information about what triggered the event
 *    - event.target - the element that triggered the event
 *    - event.preventDefault() - stop default behavior
 * 
 * 8. ARROW FUNCTIONS - Concise function syntax with =>
 *    - Useful in callbacks and functional methods like map()
 *    - this binding works differently (inherits from parent scope)
 * 
 * 9. HIGHER-ORDER FUNCTIONS - Functions that work with other functions
 *    - map(), filter(), forEach() take functions as parameters
 *    - Enables functional programming style
 * 
 * 10. CONDITIONAL LOGIC - Making decisions in code
 *     - if/else statements for branching logic
 *     - Ternary operator (condition ? true : false) for simple choices
 * 
 * 11. LOCALSTORAGE - Browser's client-side data storage
 *     - localStorage.setItem('key', JSON.stringify(data)) - save data
 *     - localStorage.getItem('key') - retrieve data
 *     - JSON.stringify() - convert objects to strings
 *     - JSON.parse() - convert strings back to objects
 *     - Data persists even after browser is closed
 * 
 * 12. TIMESTAMP AS UNIQUE ID - Using Date.now() for unique identifiers
 *     - Date.now() returns milliseconds since January 1, 1970
 *     - Works well as a unique ID for small applications
 */

/* ============================================ */
/* CONSOLE HELPER FUNCTIONS FOR DEMO */
/* ============================================ */

/**
 * Open browser console (F12) and try these commands:
 * 
 * 1. viewSavedLists()
 *    - Displays all saved shopping lists in console
 *    - Shows budget, totals, and items for each list
 * 
 * 2. getSavedShoppingLists()
 *    - Returns array of all saved lists
 *    - Useful for debugging or data inspection
 * 
 * 3. clearSavedLists()
 *    - Clears all saved shopping lists
 *    - Use when you want to reset the demo
 * 
 * MODAL AND PDF FEATURES:
 * 
 * When you generate a shopping list:
 * 1. A modal popup appears showing your complete shopping list
 * 2. The list displays all items with quantities and prices
 * 3. A summary shows your budget, total cost, and remaining balance
 * 4. You can download the list as a PDF file
 * 5. Close the modal by clicking the close button, clicking outside, or pressing Escape
 */
