// ========================================
// Sales Service - Business Logic
// ========================================

import { SaleRepository } from '../repositories/SaleRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { Sale } from '../models/Sale.js';
import { validateSale } from '../utils/validators.js';
import { eventBus } from '../utils/EventEmitter.js';
import { EVENTS } from '../config/constants.js';

export class SalesService {
    constructor() {
        this.saleRepo = new SaleRepository();
        this.productRepo = new ProductRepository();
    }

    /**
     * Get all sales
     * @returns {Array<Sale>} Array of sales
     */
    getAllSales() {
        return this.saleRepo.getAll();
    }

    /**
     * Get sale by ID
     * @param {number} id - Sale ID
     * @returns {Sale|null} Sale or null
     */
    getSale(id) {
        return this.saleRepo.getById(id);
    }

    /**
     * Process a new sale
     * @param {Object} saleData - Sale data (productId, quantity)
     * @returns {Object} Result with success and data/errors
     */
    processSale(saleData) {
        // Get product
        const product = this.productRepo.getById(saleData.productId);
        if (!product) {
            return {
                success: false,
                errors: ['Producto no encontrado']
            };
        }

        // Validate sale
        const validation = validateSale(saleData, product.stock);
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        try {
            // Create sale
            const sale = new Sale({
                productId: product.id,
                productName: product.name,
                quantity: saleData.quantity,
                price: product.price,
                cost: product.cost,
                date: new Date()
            });

            const created = this.saleRepo.create(sale);

            // Update product stock
            this.productRepo.reduceStock(product.id, saleData.quantity);

            // Emit events
            eventBus.emit(EVENTS.SALE_ADDED, created);
            eventBus.emit(EVENTS.PRODUCT_UPDATED, product);
            eventBus.emit(EVENTS.DATA_CHANGED);

            return {
                success: true,
                data: created
            };
        } catch (error) {
            return {
                success: false,
                errors: ['Error al procesar la venta: ' + error.message]
            };
        }
    }

    /**
     * Delete a sale (and restore stock)
     * @param {number} id - Sale ID
     * @returns {Object} Result with success and errors
     */
    deleteSale(id) {
        const sale = this.saleRepo.getById(id);
        if (!sale) {
            return {
                success: false,
                errors: ['Venta no encontrada']
            };
        }

        // Restore stock
        const product = this.productRepo.getById(sale.productId);
        if (product) {
            product.addStock(sale.quantity);
            this.productRepo.update(product.id, { stock: product.stock });
        }

        // Delete sale
        this.saleRepo.delete(id);

        // Emit events
        eventBus.emit(EVENTS.SALE_DELETED, id);
        eventBus.emit(EVENTS.DATA_CHANGED);

        return { success: true };
    }

    /**
     * Get sales by product
     * @param {number} productId - Product ID
     * @returns {Array<Sale>} Array of sales
     */
    getSalesByProduct(productId) {
        return this.saleRepo.getByProductId(productId);
    }

    /**
     * Get recent sales
     * @param {number} limit - Number of sales
     * @returns {Array<Sale>} Array of recent sales
     */
    getRecentSales(limit = 10) {
        return this.saleRepo.getRecent(limit);
    }

    /**
     * Get sales for today
     * @returns {Array<Sale>} Array of today's sales
     */
    getTodaySales() {
        return this.saleRepo.getToday();
    }

    /**
     * Get sales for current month
     * @returns {Array<Sale>} Array of this month's sales
     */
    getMonthSales() {
        return this.saleRepo.getThisMonth();
    }

    /**
     * Calculate sale preview (before confirming)
     * @param {number} productId - Product ID
     * @param {number} quantity - Quantity
     * @returns {Object|null} Sale preview or null
     */
    calculateSalePreview(productId, quantity) {
        const product = this.productRepo.getById(productId);
        if (!product) return null;

        const total = product.price * quantity;
        const cost = product.cost * quantity;
        const profit = total - cost;

        return {
            productName: product.name,
            quantity,
            unitPrice: product.price,
            total,
            cost,
            profit,
            availableStock: product.stock,
            canSell: product.stock >= quantity
        };
    }

    /**
     * Initialize with sample data if empty
     */
    initializeIfEmpty() {
        if (this.saleRepo.count() === 0) {
            this.saleRepo.initializeSampleData();
            eventBus.emit(EVENTS.DATA_CHANGED);
        }
    }
}
