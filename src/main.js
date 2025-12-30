// ========================================
// Application Controller - Main Entry Point
// ========================================

import { InventoryService } from './services/InventoryService.js';
import { SalesService } from './services/SalesService.js';
import { AnalyticsService } from './services/AnalyticsService.js';
import { DashboardView } from './views/DashboardView.js';
import { InventoryView } from './views/InventoryView.js';
import { SalesView } from './views/SalesView.js';
import { ProfitsView } from './views/ProfitsView.js';
import { Modal } from './components/Modal.js';
import { eventBus } from './utils/EventEmitter.js';
import { EVENTS, VIEWS, CATEGORIES } from './config/constants.js';
import { formatCurrency } from './utils/formatters.js';

class AppController {
    constructor() {
        // Initialize services
        this.inventoryService = new InventoryService();
        this.salesService = new SalesService();
        this.analyticsService = new AnalyticsService();

        // Initialize views
        this.dashboardView = new DashboardView(this.analyticsService);
        this.inventoryView = new InventoryView(this.inventoryService);
        this.salesView = new SalesView(this.salesService);
        this.profitsView = new ProfitsView(this.analyticsService);

        // Current view
        this.currentView = VIEWS.DASHBOARD;

        // Modals
        this.addProductModal = null;
        this.addSaleModal = null;
    }

    /**
     * Initialize the application
     */
    init() {
        // Initialize data if empty
        this.inventoryService.initializeIfEmpty();
        this.salesService.initializeIfEmpty();

        // Setup navigation
        this.setupNavigation();

        // Setup modals
        this.setupModals();

        // Setup event listeners
        this.setupEventListeners();

        // Render initial view
        this.renderCurrentView();
    }

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewName = item.dataset.view;
                this.switchView(viewName);

                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    /**
     * Switch to a different view
     */
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;
        this.renderCurrentView();
    }

    /**
     * Render current view
     */
    renderCurrentView() {
        switch (this.currentView) {
            case VIEWS.DASHBOARD:
                this.dashboardView.render();
                break;
            case VIEWS.INVENTORY:
                this.inventoryView.render();
                break;
            case VIEWS.SALES:
                this.salesView.render();
                break;
            case VIEWS.PROFITS:
                this.profitsView.render();
                break;
        }
    }

    /**
     * Setup modals
     */
    setupModals() {
        this.setupAddProductModal();
        this.setupAddSaleModal();
    }

    /**
     * Setup add product modal
     */
    setupAddProductModal() {
        const modalContent = `
      <form id="add-product-form">
        <div class="form-group">
          <label for="product-name">Nombre del Producto</label>
          <input type="text" id="product-name" name="name" required placeholder="Ej: Camiseta Básica">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="product-category">Categoría</label>
            <select id="product-category" name="category" required>
              <option value="">Seleccionar...</option>
              ${CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="product-stock">Stock Inicial</label>
            <input type="number" id="product-stock" name="stock" required min="0" placeholder="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="product-cost">Costo ($)</label>
            <input type="number" id="product-cost" name="cost" required min="0" step="0.01" placeholder="0.00">
          </div>
          <div class="form-group">
            <label for="product-price">Precio de Venta ($)</label>
            <input type="number" id="product-price" name="price" required min="0" step="0.01" placeholder="0.00">
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" data-modal-close>Cancelar</button>
          <button type="submit" class="btn-primary">Agregar Producto</button>
        </div>
      </form>
    `;

        this.addProductModal = new Modal({
            id: 'add-product-modal',
            title: 'Agregar Nuevo Producto',
            onSubmit: (data, form) => this.handleAddProduct(data, form)
        });

        this.addProductModal.mount(modalContent);

        // Attach button
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.addProductModal.show();
        });
    }

    /**
     * Setup add sale modal
     */
    setupAddSaleModal() {
        const modalContent = `
      <form id="add-sale-form">
        <div class="form-group">
          <label for="sale-product">Producto</label>
          <select id="sale-product" name="productId" required>
            <option value="">Seleccionar producto...</option>
          </select>
        </div>
        <div class="form-group">
          <label for="sale-quantity">Cantidad</label>
          <input type="number" id="sale-quantity" name="quantity" required min="1" placeholder="1">
        </div>
        <div class="sale-summary" id="sale-summary" style="display: none;">
          <div class="summary-row">
            <span>Precio unitario:</span>
            <span id="summary-price">$0.00</span>
          </div>
          <div class="summary-row">
            <span>Total:</span>
            <span id="summary-total">$0.00</span>
          </div>
          <div class="summary-row highlight">
            <span>Ganancia:</span>
            <span id="summary-profit">$0.00</span>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" data-modal-close>Cancelar</button>
          <button type="submit" class="btn-primary">Registrar Venta</button>
        </div>
      </form>
    `;

        this.addSaleModal = new Modal({
            id: 'add-sale-modal',
            title: 'Registrar Nueva Venta',
            onSubmit: (data, form) => this.handleAddSale(data, form)
        });

        this.addSaleModal.mount(modalContent);

        // Attach button
        document.getElementById('add-sale-btn').addEventListener('click', () => {
            this.salesView.updateProductSelect(this.inventoryService.getAllProducts());
            this.addSaleModal.show();
        });

        // Setup sale preview
        this.setupSalePreview();
    }

    /**
     * Setup sale preview calculation
     */
    setupSalePreview() {
        const productSelect = document.getElementById('sale-product');
        const quantityInput = document.getElementById('sale-quantity');

        const updatePreview = () => {
            const productId = parseInt(productSelect.value);
            const quantity = parseInt(quantityInput.value) || 0;

            if (productId && quantity > 0) {
                const preview = this.salesService.calculateSalePreview(productId, quantity);
                if (preview) {
                    document.getElementById('summary-price').textContent = formatCurrency(preview.unitPrice);
                    document.getElementById('summary-total').textContent = formatCurrency(preview.total);
                    document.getElementById('summary-profit').textContent = formatCurrency(preview.profit);
                    document.getElementById('sale-summary').style.display = 'block';
                }
            } else {
                document.getElementById('sale-summary').style.display = 'none';
            }
        };

        productSelect.addEventListener('change', updatePreview);
        quantityInput.addEventListener('input', updatePreview);
    }

    /**
     * Handle add product form submission
     */
    handleAddProduct(data, form) {
        const result = this.inventoryService.addProduct({
            name: data.name,
            category: data.category,
            stock: parseInt(data.stock),
            cost: parseFloat(data.cost),
            price: parseFloat(data.price)
        });

        if (result.success) {
            form.reset();
            this.addProductModal.hide();
            this.showNotification('Producto agregado exitosamente', 'success');
        } else {
            this.showNotification(result.errors.join(', '), 'error');
        }
    }

    /**
     * Handle add sale form submission
     */
    handleAddSale(data, form) {
        const result = this.salesService.processSale({
            productId: parseInt(data.productId),
            quantity: parseInt(data.quantity)
        });

        if (result.success) {
            form.reset();
            this.addSaleModal.hide();
            document.getElementById('sale-summary').style.display = 'none';
            this.showNotification('Venta registrada exitosamente', 'success');
        } else {
            this.showNotification(result.errors.join(', '), 'error');
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Listen to data changes
        eventBus.on(EVENTS.DATA_CHANGED, () => {
            this.renderCurrentView();
        });
    }

    /**
     * Show notification (simple alert for now)
     */
    showNotification(message, type = 'info') {
        // For now, use alert. Can be replaced with a toast notification later
        alert(message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.init();
});
