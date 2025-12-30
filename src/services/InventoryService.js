// ========================================
// Inventory Service - Business Logic (Firebase)
// ========================================

import FirebaseRepository from '../repositories/FirebaseRepository.js';
import { Product } from '../models/Product.js';
import { validateProduct } from '../utils/validators.js';
import { eventBus } from '../utils/EventEmitter.js';
import { EVENTS } from '../config/constants.js';

const PRODUCTS_COLLECTION = 'products';

export class InventoryService {
    constructor() {
        this.firebaseRepo = FirebaseRepository;
    }

    /**
     * Get all products
     * @returns {Promise<Array<Product>>} Array of products
     */
    async getAllProducts() {
        try {
            const productsData = await this.firebaseRepo.getAll(PRODUCTS_COLLECTION);
            return productsData.map(data => new Product(data));
        } catch (error) {
            console.error('Error getting products:', error);
            return [];
        }
    }

    /**
     * Get product by ID
     * @param {string} id - Product ID
     * @returns {Promise<Product|null>} Product or null
     */
    async getProduct(id) {
        try {
            const data = await this.firebaseRepo.getById(PRODUCTS_COLLECTION, id);
            return data ? new Product(data) : null;
        } catch (error) {
            console.error('Error getting product:', error);
            return null;
        }
    }

    /**
     * Add a new product
     * @param {Object} productData - Product data
     * @returns {Promise<Object>} Result with success and data/errors
     */
    async addProduct(productData) {
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
            const created = await this.firebaseRepo.create(PRODUCTS_COLLECTION, product.toJSON());

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
     * @param {string} id - Product ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<Object>} Result with success and data/errors
     */
    async updateProduct(id, updates) {
        try {
            const product = await this.getProduct(id);
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

            const updated = await this.firebaseRepo.update(PRODUCTS_COLLECTION, id, updates);

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
     * @param {string} id - Product ID
     * @returns {Promise<Object>} Result with success and errors
     */
    async deleteProduct(id) {
        try {
            const deleted = await this.firebaseRepo.delete(PRODUCTS_COLLECTION, id);
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
        } catch (error) {
            return {
                success: false,
                errors: ['Error al eliminar el producto: ' + error.message]
            };
        }
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Promise<Array<Product>>} Array of products
     */
    async getProductsByCategory(category) {
        try {
            const productsData = await this.firebaseRepo.query(
                PRODUCTS_COLLECTION,
                [['category', '==', category]]
            );
            return productsData.map(data => new Product(data));
        } catch (error) {
            console.error('Error getting products by category:', error);
            return [];
        }
    }

    /**
     * Search products
     * @param {string} query - Search query
     * @returns {Promise<Array<Product>>} Array of matching products
     */
    async searchProducts(query) {
        try {
            const allProducts = await this.getAllProducts();
            const lowerQuery = query.toLowerCase();
            return allProducts.filter(product =>
                product.name.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    /**
     * Get low stock products
     * @returns {Promise<Array<Product>>} Array of low stock products
     */
    async getLowStockProducts() {
        try {
            const allProducts = await this.getAllProducts();
            return allProducts.filter(product => product.isLowStock());
        } catch (error) {
            console.error('Error getting low stock products:', error);
            return [];
        }
    }

    /**
     * Get out of stock products
     * @returns {Promise<Array<Product>>} Array of out of stock products
     */
    async getOutOfStockProducts() {
        try {
            const allProducts = await this.getAllProducts();
            return allProducts.filter(product => product.isOutOfStock());
        } catch (error) {
            console.error('Error getting out of stock products:', error);
            return [];
        }
    }

    /**
     * Calculate total inventory value (at cost)
     * @returns {Promise<number>} Total inventory value
     */
    async getTotalInventoryValue() {
        const products = await this.getAllProducts();
        return products.reduce((sum, product) => sum + (product.cost * product.stock), 0);
    }

    /**
     * Calculate total inventory value (at selling price)
     * @returns {Promise<number>} Total potential revenue
     */
    async getTotalPotentialRevenue() {
        const products = await this.getAllProducts();
        return products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    }

    /**
     * Calculate total stock count
     * @returns {Promise<number>} Total units in stock
     */
    async getTotalStock() {
        const products = await this.getAllProducts();
        return products.reduce((sum, product) => sum + product.stock, 0);
    }

    /**
     * Get stock alerts
     * @returns {Promise<Object>} Stock alerts
     */
    async getStockAlerts() {
        return {
            lowStock: await this.getLowStockProducts(),
            outOfStock: await this.getOutOfStockProducts()
        };
    }

    /**
     * Reduce stock for a product
     * @param {string} id - Product ID
     * @param {number} quantity - Quantity to reduce
     * @returns {Promise<Object>} Result with success and errors
     */
    async reduceStock(id, quantity) {
        try {
            const product = await this.getProduct(id);
            if (!product) {
                return {
                    success: false,
                    errors: ['Producto no encontrado']
                };
            }

            const newStock = product.stock - quantity;
            if (newStock < 0) {
                return {
                    success: false,
                    errors: ['Stock insuficiente']
                };
            }

            return await this.updateProduct(id, { stock: newStock });
        } catch (error) {
            return {
                success: false,
                errors: ['Error al reducir stock: ' + error.message]
            };
        }
    }
}
