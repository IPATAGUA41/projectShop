// ========================================
// Data Management
// ========================================
let inventory = [];
let sales = [];

// ========================================
// Initialize App with Sample Data
// ========================================
function initializeApp() {
    // Sample inventory data
    inventory = [
        {
            id: 1,
            name: 'Camiseta Básica Blanca',
            category: 'Camisetas',
            stock: 45,
            cost: 8.50,
            price: 19.99
        },
        {
            id: 2,
            name: 'Jeans Slim Fit',
            category: 'Pantalones',
            stock: 28,
            cost: 25.00,
            price: 59.99
        },
        {
            id: 3,
            name: 'Vestido Floral Verano',
            category: 'Vestidos',
            stock: 15,
            cost: 30.00,
            price: 79.99
        },
        {
            id: 4,
            name: 'Chaqueta de Cuero',
            category: 'Chaquetas',
            stock: 8,
            cost: 80.00,
            price: 199.99
        },
        {
            id: 5,
            name: 'Bufanda de Lana',
            category: 'Accesorios',
            stock: 32,
            cost: 12.00,
            price: 29.99
        },
        {
            id: 6,
            name: 'Camiseta Estampada',
            category: 'Camisetas',
            stock: 52,
            cost: 10.00,
            price: 24.99
        },
        {
            id: 7,
            name: 'Pantalón Deportivo',
            category: 'Pantalones',
            stock: 38,
            cost: 18.00,
            price: 44.99
        },
        {
            id: 8,
            name: 'Vestido de Noche',
            category: 'Vestidos',
            stock: 6,
            cost: 60.00,
            price: 149.99
        }
    ];

    // Sample sales data
    sales = [
        {
            id: 1,
            productId: 1,
            productName: 'Camiseta Básica Blanca',
            quantity: 5,
            price: 19.99,
            cost: 8.50,
            date: new Date('2025-12-28')
        },
        {
            id: 2,
            productId: 2,
            productName: 'Jeans Slim Fit',
            quantity: 3,
            price: 59.99,
            cost: 25.00,
            date: new Date('2025-12-28')
        },
        {
            id: 3,
            productId: 3,
            productName: 'Vestido Floral Verano',
            quantity: 2,
            price: 79.99,
            cost: 30.00,
            date: new Date('2025-12-29')
        },
        {
            id: 4,
            productId: 5,
            productName: 'Bufanda de Lana',
            quantity: 4,
            price: 29.99,
            cost: 12.00,
            date: new Date('2025-12-29')
        },
        {
            id: 5,
            productId: 6,
            productName: 'Camiseta Estampada',
            quantity: 7,
            price: 24.99,
            cost: 10.00,
            date: new Date('2025-12-30')
        }
    ];

    // Load data from localStorage if available
    const savedInventory = localStorage.getItem('inventory');
    const savedSales = localStorage.getItem('sales');

    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
    }

    if (savedSales) {
        sales = JSON.parse(savedSales).map(sale => ({
            ...sale,
            date: new Date(sale.date)
        }));
    }

    updateAllViews();
}

// ========================================
// Save Data to LocalStorage
// ========================================
function saveData() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('sales', JSON.stringify(sales));
}

// ========================================
// Navigation
// ========================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.dataset.view;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update active view
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
            });
            document.getElementById(`${viewName}-view`).classList.add('active');

            // Update view content
            updateView(viewName);
        });
    });
}

// ========================================
// Update Views
// ========================================
function updateAllViews() {
    updateDashboard();
    updateInventory();
    updateSales();
    updateProfits();
}

function updateView(viewName) {
    switch (viewName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'inventory':
            updateInventory();
            break;
        case 'sales':
            updateSales();
            break;
        case 'profits':
            updateProfits();
            break;
    }
}

// ========================================
// Dashboard View
// ========================================
function updateDashboard() {
    // Calculate stats
    const totalInventory = inventory.reduce((sum, item) => sum + item.stock, 0);
    const totalSalesAmount = sales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    const totalCosts = sales.reduce((sum, sale) => sum + (sale.cost * sale.quantity), 0);
    const totalProfit = totalSalesAmount - totalCosts;
    const avgMargin = totalSalesAmount > 0 ? ((totalProfit / totalSalesAmount) * 100).toFixed(1) : 0;

    // Update stat cards
    document.getElementById('total-inventory').textContent = totalInventory;
    document.getElementById('total-sales').textContent = `$${totalSalesAmount.toFixed(2)}`;
    document.getElementById('total-profit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('avg-margin').textContent = `${avgMargin}%`;

    // Update top products
    const productSales = {};
    sales.forEach(sale => {
        if (!productSales[sale.productId]) {
            productSales[sale.productId] = {
                name: sale.productName,
                quantity: 0,
                revenue: 0
            };
        }
        productSales[sale.productId].quantity += sale.quantity;
        productSales[sale.productId].revenue += sale.price * sale.quantity;
    });

    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const topProductsHTML = topProducts.map(product => `
        <div class="product-item">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sales">${product.quantity} unidades vendidas</div>
            </div>
            <div class="product-revenue">$${product.revenue.toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById('top-products').innerHTML = topProductsHTML || '<p style="color: var(--text-secondary);">No hay ventas registradas</p>';

    // Update recent sales
    const recentSales = [...sales]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

    const recentSalesHTML = recentSales.map(sale => `
        <div class="sale-item">
            <div class="sale-info">
                <div class="sale-product">${sale.productName}</div>
                <div class="sale-date">${formatDate(sale.date)}</div>
            </div>
            <div class="sale-amount">$${(sale.price * sale.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById('recent-sales').innerHTML = recentSalesHTML || '<p style="color: var(--text-secondary);">No hay ventas registradas</p>';
}

// ========================================
// Inventory View
// ========================================
function updateInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');

    const inventoryHTML = inventory.map(item => {
        const profit = item.price - item.cost;
        const margin = ((profit / item.price) * 100).toFixed(1);
        const stockLevel = item.stock > 30 ? 'high' : item.stock > 10 ? 'medium' : 'low';

        return `
            <div class="inventory-card">
                <div class="inventory-header">
                    <span class="inventory-category">${item.category}</span>
                </div>
                <h3 class="inventory-name">${item.name}</h3>
                <div class="inventory-details">
                    <div class="detail-row">
                        <span class="detail-label">Stock:</span>
                        <span class="stock-badge ${stockLevel}">${item.stock} unidades</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Costo:</span>
                        <span class="detail-value">$${item.cost.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Precio:</span>
                        <span class="detail-value">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="inventory-profit">
                    <span class="profit-label">Ganancia por unidad:</span>
                    <span class="profit-value">$${profit.toFixed(2)} (${margin}%)</span>
                </div>
            </div>
        `;
    }).join('');

    inventoryGrid.innerHTML = inventoryHTML;
}

// ========================================
// Sales View
// ========================================
function updateSales() {
    const salesTableBody = document.getElementById('sales-table-body');

    const salesHTML = [...sales]
        .sort((a, b) => b.date - a.date)
        .map(sale => {
            const total = sale.price * sale.quantity;
            const profit = (sale.price - sale.cost) * sale.quantity;

            return `
                <tr>
                    <td>${formatDate(sale.date)}</td>
                    <td>${sale.productName}</td>
                    <td>${sale.quantity}</td>
                    <td>$${sale.price.toFixed(2)}</td>
                    <td>$${total.toFixed(2)}</td>
                    <td style="color: #00f2fe; font-weight: 600;">$${profit.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

    salesTableBody.innerHTML = salesHTML || '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No hay ventas registradas</td></tr>';

    // Update product select in sale modal
    updateSaleProductSelect();
}

function updateSaleProductSelect() {
    const select = document.getElementById('sale-product');
    const options = inventory
        .filter(item => item.stock > 0)
        .map(item => `<option value="${item.id}">${item.name} (Stock: ${item.stock})</option>`)
        .join('');

    select.innerHTML = '<option value="">Seleccionar producto...</option>' + options;
}

// ========================================
// Profits View
// ========================================
function updateProfits() {
    // Calculate totals
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    const totalCosts = sales.reduce((sum, sale) => sum + (sale.cost * sale.quantity), 0);
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

    document.getElementById('profit-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('profit-costs').textContent = `$${totalCosts.toFixed(2)}`;
    document.getElementById('profit-net').textContent = `$${netProfit.toFixed(2)}`;
    document.getElementById('profit-margin').textContent = `${profitMargin}%`;

    // Category profits
    const categoryProfits = {};
    sales.forEach(sale => {
        const product = inventory.find(p => p.id === sale.productId);
        if (product) {
            const category = product.category;
            if (!categoryProfits[category]) {
                categoryProfits[category] = 0;
            }
            categoryProfits[category] += (sale.price - sale.cost) * sale.quantity;
        }
    });

    const maxProfit = Math.max(...Object.values(categoryProfits), 1);
    const categoryProfitsHTML = Object.entries(categoryProfits)
        .sort((a, b) => b[1] - a[1])
        .map(([category, profit]) => {
            const percentage = (profit / maxProfit) * 100;
            return `
                <div class="category-item">
                    <div class="category-header">
                        <span class="category-name">${category}</span>
                        <span class="category-profit">$${profit.toFixed(2)}</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

    document.getElementById('category-profits').innerHTML = categoryProfitsHTML || '<p style="color: var(--text-secondary);">No hay datos disponibles</p>';

    // Product profitability table
    const productProfits = {};
    sales.forEach(sale => {
        if (!productProfits[sale.productId]) {
            const product = inventory.find(p => p.id === sale.productId);
            productProfits[sale.productId] = {
                name: sale.productName,
                category: product ? product.category : 'N/A',
                units: 0,
                revenue: 0,
                costs: 0
            };
        }
        productProfits[sale.productId].units += sale.quantity;
        productProfits[sale.productId].revenue += sale.price * sale.quantity;
        productProfits[sale.productId].costs += sale.cost * sale.quantity;
    });

    const productProfitsHTML = Object.values(productProfits)
        .map(product => {
            const profit = product.revenue - product.costs;
            const margin = ((profit / product.revenue) * 100).toFixed(1);
            return `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.units}</td>
                    <td>$${product.revenue.toFixed(2)}</td>
                    <td style="color: #f5576c;">$${product.costs.toFixed(2)}</td>
                    <td style="color: #00f2fe; font-weight: 600;">$${profit.toFixed(2)}</td>
                    <td>${margin}%</td>
                </tr>
            `;
        }).join('');

    document.getElementById('profit-products-table').innerHTML = productProfitsHTML || '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No hay datos disponibles</td></tr>';
}

// ========================================
// Modal Management
// ========================================
function setupModals() {
    // Add Product Modal
    const addProductBtn = document.getElementById('add-product-btn');
    const addProductModal = document.getElementById('add-product-modal');
    const addProductForm = document.getElementById('add-product-form');

    addProductBtn.addEventListener('click', () => {
        addProductModal.classList.add('active');
    });

    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            stock: parseInt(document.getElementById('product-stock').value),
            cost: parseFloat(document.getElementById('product-cost').value),
            price: parseFloat(document.getElementById('product-price').value)
        };

        inventory.push(newProduct);
        saveData();
        updateAllViews();

        addProductForm.reset();
        addProductModal.classList.remove('active');
    });

    // Add Sale Modal
    const addSaleBtn = document.getElementById('add-sale-btn');
    const addSaleModal = document.getElementById('add-sale-modal');
    const addSaleForm = document.getElementById('add-sale-form');
    const saleProductSelect = document.getElementById('sale-product');
    const saleQuantityInput = document.getElementById('sale-quantity');

    addSaleBtn.addEventListener('click', () => {
        updateSaleProductSelect();
        addSaleModal.classList.add('active');
    });

    // Update sale summary when product or quantity changes
    function updateSaleSummary() {
        const productId = parseInt(saleProductSelect.value);
        const quantity = parseInt(saleQuantityInput.value) || 0;
        const product = inventory.find(p => p.id === productId);

        if (product && quantity > 0) {
            const total = product.price * quantity;
            const profit = (product.price - product.cost) * quantity;

            document.getElementById('summary-price').textContent = `$${product.price.toFixed(2)}`;
            document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
            document.getElementById('summary-profit').textContent = `$${profit.toFixed(2)}`;
            document.getElementById('sale-summary').style.display = 'block';
        } else {
            document.getElementById('sale-summary').style.display = 'none';
        }
    }

    saleProductSelect.addEventListener('change', updateSaleSummary);
    saleQuantityInput.addEventListener('input', updateSaleSummary);

    addSaleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productId = parseInt(saleProductSelect.value);
        const quantity = parseInt(saleQuantityInput.value);
        const product = inventory.find(p => p.id === productId);

        if (!product) {
            alert('Por favor selecciona un producto válido');
            return;
        }

        if (quantity > product.stock) {
            alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
            return;
        }

        const newSale = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: product.price,
            cost: product.cost,
            date: new Date()
        };

        sales.push(newSale);
        product.stock -= quantity;

        saveData();
        updateAllViews();

        addSaleForm.reset();
        addSaleModal.classList.remove('active');
    });

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ========================================
// Utility Functions
// ========================================
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// ========================================
// Initialize Application
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupNavigation();
    setupModals();
});
