// ========================================
// Inventory Service - Business Logic
// ========================================

import { ProductRepository } from '../repositories/ProductRepository.js';
import { Product } from '../models/Product.js';
import { validateProduct } from '../utils/validators.js';
import { eventBus } from '../utils/EventEmitter.js';
import { EVENTS } from '../config/constants.js';

export class InventoryService {
    constructor() {
        this.productRepo = new ProductRepository();
    }

    /**
     * Get all products
     * @returns {Array<Product>} Array of products
     */
    getAllProducts() {
        return this.productRepo.getAll();
    }

    /**
     * Get product by ID
     * @param {number} id - Product ID
     * @returns {Product|null} Product or null
     */
    getProduct(id) {
        return this.productRepo.getById(id);
    }

    /**
     * Add a new product
     * @param {Object} productData - Product data
     * @returns {Object} Result with success and data/errors
     */
    addProduct(productData) {
        // Validate product data
        const validation = validateProduct(productData);
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        try {
            const product = new Product(productData);
            const created = this.productRepo.create(product);

            // Emit event
            eventBus.emit(EVENTS.PRODUCT_ADDED, created);
            eventBus.emit(EVENTS.DATA_CHANGED);

            return {
                success: true,
                data: created
            };
        } catch (error) {
            return {
                success: false,
                errors: ['Error al crear el producto: ' + error.message]
            };
        }
    }

    /**
     * Update a product
     * @param {number} id - Product ID
     * @param {Object} updates - Updates to apply
     * @returns {Object} Result with success and data/errors
     */
    updateProduct(id, updates) {
        const product = this.productRepo.getById(id);
        if (!product) {
            return {
                success: false,
                errors: ['Producto no encontrado']
            };
        }

        // Validate updated data
        const updatedData = { ...product.toJSON(), ...updates };
        const validation = validateProduct(updatedData);
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        try {
            const updated = this.productRepo.update(id, updates);

            // Emit event
            eventBus.emit(EVENTS.PRODUCT_UPDATED, updated);
            eventBus.emit(EVENTS.DATA_CHANGED);

            return {
                success: true,
                data: updated
            };
        } catch (error) {
            return {
                success: false,
                errors: ['Error al actualizar el producto: ' + error.message]
            };
        }
    }

    /**
     * Delete a product
     * @param {number} id - Product ID
     * @returns {Object} Result with success and errors
     */
    deleteProduct(id) {
        const deleted = this.productRepo.delete(id);
        if (!deleted) {
            return {
                success: false,
                errors: ['Producto no encontrado']
            };
        }

        // Emit event
        eventBus.emit(EVENTS.PRODUCT_DELETED, id);
        eventBus.emit(EVENTS.DATA_CHANGED);

        return { success: true };
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Array<Product>} Array of products
     */
    getProductsByCategory(category) {
        return this.productRepo.getByCategory(category);
    }

    /**
     * Search products
     * @param {string} query - Search query
     * @returns {Array<Product>} Array of matching products
     */
    searchProducts(query) {
        return this.productRepo.search(query);
    }

    /**
     * Get low stock products
     * @returns {Array<Product>} Array of low stock products
     */
    getLowStockProducts() {
        return this.productRepo.getLowStock();
    }

    /**
     * Get out of stock products
     * @returns {Array<Product>} Array of out of stock products
     */
    getOutOfStockProducts() {
        return this.productRepo.getOutOfStock();
    }

    /**
     * Calculate total inventory value (at cost)
     * @returns {number} Total inventory value
     */
    getTotalInventoryValue() {
        const products = this.productRepo.getAll();
        return products.reduce((sum, product) => sum + (product.cost * product.stock), 0);
    }

    /**
     * Calculate total inventory value (at selling price)
     * @returns {number} Total potential revenue
     */
    getTotalPotentialRevenue() {
        const products = this.productRepo.getAll();
        return products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    }

    /**
     * Calculate total stock count
     * @returns {number} Total units in stock
     */
    getTotalStock() {
        const products = this.productRepo.getAll();
        return products.reduce((sum, product) => sum + product.stock, 0);
    }

    /**
     * Get stock alerts
     * @returns {Object} Stock alerts
     */
    getStockAlerts() {
        return {
            lowStock: this.getLowStockProducts(),
            outOfStock: this.getOutOfStockProducts()
        };
    }

    /**
     * Initialize with sample data if empty
     */
    initializeIfEmpty() {
        if (this.productRepo.count() === 0) {
            this.productRepo.initializeSampleData();
            eventBus.emit(EVENTS.DATA_CHANGED);
        }
    }
}
