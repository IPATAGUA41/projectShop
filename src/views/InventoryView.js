// ========================================
// Inventory View
// ========================================

import { formatCurrency } from '../utils/formatters.js';

export class InventoryView {
    constructor(inventoryService) {
        this.inventory = inventoryService;
    }

    /**
     * Render inventory view
     */
    render() {
        const products = this.inventory.getAllProducts();
        const container = document.getElementById('inventory-grid');

        if (!products || products.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No hay productos en el inventario</p>';
            return;
        }

        const html = products.map(product => this.renderProductCard(product)).join('');
        container.innerHTML = html;
    }

    /**
     * Render a single product card
     */
    renderProductCard(product) {
        const profit = product.getProfit();
        const margin = product.getMargin();
        const stockLevel = product.getStockLevel();

        return `
      <div class="inventory-card" data-product-id="${product.id}">
        <div class="inventory-header">
          <span class="inventory-category">${product.category}</span>
        </div>
        <h3 class="inventory-name">${product.name}</h3>
        <div class="inventory-details">
          <div class="detail-row">
            <span class="detail-label">Stock:</span>
            <span class="stock-badge ${stockLevel}">${product.stock} unidades</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Costo:</span>
            <span class="detail-value">${formatCurrency(product.cost)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Precio:</span>
            <span class="detail-value">${formatCurrency(product.price)}</span>
          </div>
        </div>
        <div class="inventory-profit">
          <span class="profit-label">Ganancia por unidad:</span>
          <span class="profit-value">${formatCurrency(profit)} (${margin.toFixed(1)}%)</span>
        </div>
      </div>
    `;
    }
}
