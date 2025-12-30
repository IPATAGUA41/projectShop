// ========================================
// Dashboard View
// ========================================

import { formatCurrency, formatDate } from '../utils/formatters.js';

export class DashboardView {
    constructor(analyticsService) {
        this.analytics = analyticsService;
    }

    /**
     * Render dashboard view
     */
    render() {
        const stats = this.analytics.getDashboardStats();

        this.renderStats(stats);
        this.renderTopProducts(stats.topProducts);
        this.renderRecentSales(stats.recentSales);
    }

    /**
     * Render statistics cards
     */
    renderStats(stats) {
        document.getElementById('total-inventory').textContent = stats.totalInventory;
        document.getElementById('total-sales').textContent = formatCurrency(stats.totalSales);
        document.getElementById('total-profit').textContent = formatCurrency(stats.totalProfit);
        document.getElementById('avg-margin').textContent = `${stats.avgMargin.toFixed(1)}%`;
    }

    /**
     * Render top products
     */
    renderTopProducts(products) {
        const container = document.getElementById('top-products');

        if (!products || products.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No hay ventas registradas</p>';
            return;
        }

        const html = products.map(product => `
      <div class="product-item">
        <div class="product-info">
          <div class="product-name">${product.productName}</div>
          <div class="product-sales">${product.quantity} unidades vendidas</div>
        </div>
        <div class="product-revenue">${formatCurrency(product.revenue)}</div>
      </div>
    `).join('');

        container.innerHTML = html;
    }

    /**
     * Render recent sales
     */
    renderRecentSales(sales) {
        const container = document.getElementById('recent-sales');

        if (!sales || sales.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No hay ventas registradas</p>';
            return;
        }

        const html = sales.map(sale => `
      <div class="sale-item">
        <div class="sale-info">
          <div class="sale-product">${sale.productName}</div>
          <div class="sale-date">${formatDate(sale.date)}</div>
        </div>
        <div class="sale-amount">${formatCurrency(sale.getTotal())}</div>
      </div>
    `).join('');

        container.innerHTML = html;
    }
}
