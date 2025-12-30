// ========================================
// Profits View
// ========================================

import { formatCurrency, formatPercentage } from '../utils/formatters.js';

export class ProfitsView {
    constructor(analyticsService) {
        this.analytics = analyticsService;
    }

    /**
     * Render profits view
     */
    render() {
        this.renderFinancialSummary();
        this.renderCategoryProfits();
        this.renderProductProfitability();
    }

    /**
     * Render financial summary
     */
    renderFinancialSummary() {
        const revenue = this.analytics.getTotalRevenue();
        const costs = this.analytics.getTotalCosts();
        const profit = this.analytics.getTotalProfit();
        const margin = this.analytics.getAverageMargin();

        document.getElementById('profit-revenue').textContent = formatCurrency(revenue);
        document.getElementById('profit-costs').textContent = formatCurrency(costs);
        document.getElementById('profit-net').textContent = formatCurrency(profit);
        document.getElementById('profit-margin').textContent = formatPercentage(margin);
    }

    /**
     * Render category profits
     */
    renderCategoryProfits() {
        const categoryProfits = this.analytics.getProfitsByCategory();
        const container = document.getElementById('category-profits');

        if (!categoryProfits || categoryProfits.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No hay datos disponibles</p>';
            return;
        }

        const maxProfit = Math.max(...categoryProfits.map(c => c.profit), 1);

        const html = categoryProfits.map(category => {
            const percentage = (category.profit / maxProfit) * 100;
            return `
        <div class="category-item">
          <div class="category-header">
            <span class="category-name">${category.category}</span>
            <span class="category-profit">${formatCurrency(category.profit)}</span>
          </div>
          <div class="category-bar">
            <div class="category-bar-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Render product profitability table
     */
    renderProductProfitability() {
        const products = this.analytics.getProductProfitability();
        const tableBody = document.getElementById('profit-products-table');

        if (!products || products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No hay datos disponibles</td></tr>';
            return;
        }

        const html = products.map(product => `
      <tr>
        <td>${product.productName}</td>
        <td>${product.category}</td>
        <td>${product.unitsSold}</td>
        <td>${formatCurrency(product.revenue)}</td>
        <td style="color: #f5576c;">${formatCurrency(product.cost)}</td>
        <td style="color: #00f2fe; font-weight: 600;">${formatCurrency(product.profit)}</td>
        <td>${formatPercentage(product.margin)}</td>
      </tr>
    `).join('');

        tableBody.innerHTML = html;
    }
}
