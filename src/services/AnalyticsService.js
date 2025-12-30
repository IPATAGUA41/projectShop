// ========================================
// Analytics Service - Statistics & Reports
// ========================================

import { SaleRepository } from '../repositories/SaleRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';

export class AnalyticsService {
    constructor() {
        this.saleRepo = new SaleRepository();
        this.productRepo = new ProductRepository();
    }

    /**
     * Calculate total revenue
     * @returns {number} Total revenue
     */
    getTotalRevenue() {
        const sales = this.saleRepo.getAll();
        return sales.reduce((sum, sale) => sum + sale.getTotal(), 0);
    }

    /**
     * Calculate total costs
     * @returns {number} Total costs
     */
    getTotalCosts() {
        const sales = this.saleRepo.getAll();
        return sales.reduce((sum, sale) => sum + sale.getTotalCost(), 0);
    }

    /**
     * Calculate total profit
     * @returns {number} Total profit
     */
    getTotalProfit() {
        return this.getTotalRevenue() - this.getTotalCosts();
    }

    /**
     * Calculate average profit margin
     * @returns {number} Average margin percentage
     */
    getAverageMargin() {
        const revenue = this.getTotalRevenue();
        if (revenue === 0) return 0;
        return (this.getTotalProfit() / revenue) * 100;
    }

    /**
     * Get top selling products
     * @param {number} limit - Number of products to return
     * @returns {Array} Array of top products with sales data
     */
    getTopProducts(limit = 5) {
        const sales = this.saleRepo.getAll();
        const productSales = {};

        // Aggregate sales by product
        sales.forEach(sale => {
            if (!productSales[sale.productId]) {
                productSales[sale.productId] = {
                    productId: sale.productId,
                    productName: sale.productName,
                    quantity: 0,
                    revenue: 0,
                    profit: 0
                };
            }
            productSales[sale.productId].quantity += sale.quantity;
            productSales[sale.productId].revenue += sale.getTotal();
            productSales[sale.productId].profit += sale.getProfit();
        });

        // Sort by revenue and limit
        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
    }

    /**
     * Get profits by category
     * @returns {Object} Profits grouped by category
     */
    getProfitsByCategory() {
        const sales = this.saleRepo.getAll();
        const products = this.productRepo.getAll();
        const categoryProfits = {};

        sales.forEach(sale => {
            const product = products.find(p => p.id === sale.productId);
            if (product) {
                const category = product.category;
                if (!categoryProfits[category]) {
                    categoryProfits[category] = {
                        category,
                        revenue: 0,
                        cost: 0,
                        profit: 0,
                        sales: 0
                    };
                }
                categoryProfits[category].revenue += sale.getTotal();
                categoryProfits[category].cost += sale.getTotalCost();
                categoryProfits[category].profit += sale.getProfit();
                categoryProfits[category].sales += 1;
            }
        });

        return Object.values(categoryProfits)
            .sort((a, b) => b.profit - a.profit);
    }

    /**
     * Get product profitability report
     * @returns {Array} Array of products with profitability data
     */
    getProductProfitability() {
        const sales = this.saleRepo.getAll();
        const products = this.productRepo.getAll();
        const productStats = {};

        // Aggregate sales data
        sales.forEach(sale => {
            if (!productStats[sale.productId]) {
                const product = products.find(p => p.id === sale.productId);
                productStats[sale.productId] = {
                    productId: sale.productId,
                    productName: sale.productName,
                    category: product ? product.category : 'N/A',
                    unitsSold: 0,
                    revenue: 0,
                    cost: 0,
                    profit: 0
                };
            }
            productStats[sale.productId].unitsSold += sale.quantity;
            productStats[sale.productId].revenue += sale.getTotal();
            productStats[sale.productId].cost += sale.getTotalCost();
            productStats[sale.productId].profit += sale.getProfit();
        });

        // Calculate margins and sort by profit
        return Object.values(productStats)
            .map(stat => ({
                ...stat,
                margin: stat.revenue > 0 ? (stat.profit / stat.revenue) * 100 : 0
            }))
            .sort((a, b) => b.profit - a.profit);
    }

    /**
     * Get dashboard statistics
     * @returns {Object} Dashboard stats
     */
    getDashboardStats() {
        const products = this.productRepo.getAll();
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const totalRevenue = this.getTotalRevenue();
        const totalProfit = this.getTotalProfit();
        const avgMargin = this.getAverageMargin();

        return {
            totalInventory: totalStock,
            totalSales: totalRevenue,
            totalProfit,
            avgMargin,
            topProducts: this.getTopProducts(5),
            recentSales: this.saleRepo.getRecent(5)
        };
    }

    /**
     * Get sales trend data
     * @param {number} days - Number of days to analyze
     * @returns {Array} Array of daily sales data
     */
    getSalesTrend(days = 7) {
        const sales = this.saleRepo.getAll();
        const trend = {};

        // Initialize days
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            trend[dateKey] = {
                date: dateKey,
                sales: 0,
                revenue: 0,
                profit: 0
            };
        }

        // Aggregate sales by day
        sales.forEach(sale => {
            const dateKey = new Date(sale.date).toISOString().split('T')[0];
            if (trend[dateKey]) {
                trend[dateKey].sales += 1;
                trend[dateKey].revenue += sale.getTotal();
                trend[dateKey].profit += sale.getProfit();
            }
        });

        return Object.values(trend).reverse();
    }

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        const sales = this.saleRepo.getAll();
        const products = this.productRepo.getAll();

        return {
            totalProducts: products.length,
            totalSales: sales.length,
            averageSaleValue: sales.length > 0 ? this.getTotalRevenue() / sales.length : 0,
            averageUnitsPerSale: sales.length > 0
                ? sales.reduce((sum, s) => sum + s.quantity, 0) / sales.length
                : 0,
            lowStockProducts: products.filter(p => p.isLowStock()).length,
            outOfStockProducts: products.filter(p => !p.isInStock()).length
        };
    }
}
