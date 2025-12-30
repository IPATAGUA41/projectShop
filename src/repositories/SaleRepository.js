// ========================================
// Sale Repository
// ========================================

import { BaseRepository } from './BaseRepository.js';
import { Sale } from '../models/Sale.js';
import { STORAGE_KEYS } from '../config/constants.js';

export class SaleRepository extends BaseRepository {
    constructor() {
        super(STORAGE_KEYS.SALES);
    }

    /**
     * Get all sales as Sale instances
     * @returns {Array<Sale>} Array of Sale instances
     */
    getAll() {
        const data = super.getAll();
        return data.map(item => Sale.fromJSON(item));
    }

    /**
     * Get sale by ID as Sale instance
     * @param {number} id - Sale ID
     * @returns {Sale|null} Sale instance or null
     */
    getById(id) {
        const data = super.getById(id);
        return data ? Sale.fromJSON(data) : null;
    }

    /**
     * Create a new sale
     * @param {Sale} sale - Sale instance
     * @returns {Sale} Created sale
     */
    create(sale) {
        const data = super.create(sale.toJSON());
        return Sale.fromJSON(data);
    }

    /**
     * Get sales by product ID
     * @param {number} productId - Product ID
     * @returns {Array<Sale>} Array of sales
     */
    getByProductId(productId) {
        return this.getAll().filter(sale => sale.productId === productId);
    }

    /**
     * Get sales by date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array<Sale>} Array of sales
     */
    getByDateRange(startDate, endDate) {
        return this.getAll().filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    /**
     * Get recent sales
     * @param {number} limit - Number of sales to return
     * @returns {Array<Sale>} Array of recent sales
     */
    getRecent(limit = 10) {
        return this.getAll()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    /**
     * Get sales for today
     * @returns {Array<Sale>} Array of today's sales
     */
    getToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.getByDateRange(today, tomorrow);
    }

    /**
     * Get sales for current month
     * @returns {Array<Sale>} Array of this month's sales
     */
    getThisMonth() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return this.getByDateRange(startOfMonth, endOfMonth);
    }

    /**
     * Calculate total revenue
     * @returns {number} Total revenue
     */
    getTotalRevenue() {
        return this.getAll().reduce((sum, sale) => sum + sale.getTotal(), 0);
    }

    /**
     * Calculate total profit
     * @returns {number} Total profit
     */
    getTotalProfit() {
        return this.getAll().reduce((sum, sale) => sum + sale.getProfit(), 0);
    }

    /**
     * Initialize with sample data
     * @returns {Array<Sale>} Array of created sales
     */
    initializeSampleData() {
        const sampleSales = [
            {
                productId: 1,
                productName: 'Camiseta Básica Blanca',
                quantity: 5,
                price: 19.99,
                cost: 8.50,
                date: new Date('2025-12-28')
            },
            {
                productId: 2,
                productName: 'Jeans Slim Fit',
                quantity: 3,
                price: 59.99,
                cost: 25.00,
                date: new Date('2025-12-28')
            },
            {
                productId: 3,
                productName: 'Vestido Floral Verano',
                quantity: 2,
                price: 79.99,
                cost: 30.00,
                date: new Date('2025-12-29')
            },
            {
                productId: 5,
                productName: 'Bufanda de Lana',
                quantity: 4,
                price: 29.99,
                cost: 12.00,
                date: new Date('2025-12-29')
            },
            {
                productId: 6,
                productName: 'Camiseta Estampada',
                quantity: 7,
                price: 24.99,
                cost: 10.00,
                date: new Date('2025-12-30')
            }
        ];

        return sampleSales.map(data => this.create(new Sale(data)));
    }
}
