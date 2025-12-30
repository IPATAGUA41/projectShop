// ========================================
// Sales View
// ========================================

import { formatCurrency, formatDate } from '../utils/formatters.js';

export class SalesView {
    constructor(salesService) {
        this.sales = salesService;
    }

    /**
     * Render sales view
     */
    render() {
        const sales = this.sales.getAllSales();
        const tableBody = document.getElementById('sales-table-body');

        if (!sales || sales.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No hay ventas registradas</td></tr>';
            return;
        }

        // Sort by date (most recent first)
        const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

        const html = sortedSales.map(sale => `
      <tr>
        <td>${formatDate(sale.date)}</td>
        <td>${sale.productName}</td>
        <td>${sale.quantity}</td>
        <td>${formatCurrency(sale.price)}</td>
        <td>${formatCurrency(sale.getTotal())}</td>
        <td style="color: #00f2fe; font-weight: 600;">${formatCurrency(sale.getProfit())}</td>
      </tr>
    `).join('');

        tableBody.innerHTML = html;
    }

    /**
     * Update product select options
     */
    updateProductSelect(products) {
        const select = document.getElementById('sale-product');
        const availableProducts = products.filter(p => p.isInStock());

        const options = availableProducts.map(product =>
            `<option value="${product.id}">${product.name} (Stock: ${product.stock})</option>`
        ).join('');

        select.innerHTML = '<option value="">Seleccionar producto...</option>' + options;
    }
}
