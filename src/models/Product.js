// ========================================
// Product Model
// ========================================

import { STOCK_LEVELS } from '../config/constants.js';

export class Product {
    constructor(data) {
        this.id = data.id || Date.now();
        this.name = data.name;
        this.category = data.category;
        this.stock = Number(data.stock);
        this.cost = Number(data.cost);
        this.price = Number(data.price);
        this.createdAt = data.createdAt || new Date();
    }

    /**
     * Calculate profit per unit
     * @returns {number} Profit amount
     */
    getProfit() {
        return this.price - this.cost;
    }

    /**
     * Calculate profit margin percentage
     * @returns {number} Margin percentage
     */
    getMargin() {
        if (this.price === 0) return 0;
        return ((this.getProfit() / this.price) * 100);
    }

    /**
     * Get stock level (high, medium, low)
     * @returns {string} Stock level
     */
    getStockLevel() {
        if (this.stock > STOCK_LEVELS.HIGH) return 'high';
        if (this.stock > STOCK_LEVELS.MEDIUM) return 'medium';
        return 'low';
    }

    /**
     * Check if product is in stock
     * @returns {boolean} True if in stock
     */
    isInStock() {
        return this.stock > 0;
    }

    /**
     * Check if stock is low
     * @returns {boolean} True if stock is low
     */
    isLowStock() {
        return this.stock <= STOCK_LEVELS.MEDIUM && this.stock > 0;
    }

    /**
     * Reduce stock by quantity
     * @param {number} quantity - Quantity to reduce
     * @returns {boolean} True if successful
     */
    reduceStock(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
            return true;
        }
        return false;
    }

    /**
     * Increase stock by quantity
     * @param {number} quantity - Quantity to add
     */
    addStock(quantity) {
        this.stock += quantity;
    }

    /**
     * Convert to plain object for storage
     * @returns {Object} Plain object
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            stock: this.stock,
            cost: this.cost,
            price: this.price,
            createdAt: this.createdAt
        };
    }

    /**
     * Create Product instance from plain object
     * @param {Object} data - Plain object
     * @returns {Product} Product instance
     */
    static fromJSON(data) {
        return new Product({
            ...data,
            createdAt: new Date(data.createdAt)
        });
    }
}
