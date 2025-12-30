// ========================================
// Sales Service - Business Logic (Firebase)
// ========================================

import FirebaseRepository from '../repositories/FirebaseRepository.js';
import { InventoryService } from './InventoryService.js';
import { Sale } from '../models/Sale.js';
import { validateSale } from '../utils/validators.js';
import { eventBus } from '../utils/EventEmitter.js';
import { EVENTS } from '../config/constants.js';

const SALES_COLLECTION = 'sales';

export class SalesService {
    constructor() {
        this.firebaseRepo = FirebaseRepository;
        this.inventoryService = new InventoryService();
    }

    /**
     * Get all sales
     * @returns {Promise<Array<Sale>>} Array of sales
     */
    async getAllSales() {
        try {
            const salesData = await this.firebaseRepo.getAll(SALES_COLLECTION);
            return salesData.map(data => new Sale(data));
        } catch (error) {
            console.error('Error getting sales:', error);
            return [];
        }
    }

    /**
     * Get sale by ID
     * @param {string} id - Sale ID
     * @returns {Promise<Sale|null>} Sale or null
     */
    async getSale(id) {
        try {
            const data = await this.firebaseRepo.getById(SALES_COLLECTION, id);
            return data ? new Sale(data) : null;
        } catch (error) {
            console.error('Error getting sale:', error);
            return null;
        }
    }

    /**
     * Process a new sale
     * @param {Object} saleData - Sale data (productId, quantity)
     * @returns {Promise<Object>} Result with success and data/errors
     */
    async processSale(saleData) {
        try {
            // Get product
            const product = await this.inventoryService.getProduct(saleData.productId);
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

            // Create sale
            const sale = new Sale({
                productId: product.id,
                productName: product.name,
                quantity: saleData.quantity,
                price: product.price,
                cost: product.cost,
                date: new Date()
            });

            const created = await this.firebaseRepo.create(SALES_COLLECTION, sale.toJSON());

            // Update product stock
            await this.inventoryService.reduceStock(product.id, saleData.quantity);

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
     * @param {string} id - Sale ID
     * @returns {Promise<Object>} Result with success and errors
     */
    async deleteSale(id) {
        try {
            const sale = await this.getSale(id);
            if (!sale) {
                return {
                    success: false,
                    errors: ['Venta no encontrada']
                };
            }

            // Restore stock
            const product = await this.inventoryService.getProduct(sale.productId);
            if (product) {
                const newStock = product.stock + sale.quantity;
                await this.inventoryService.updateProduct(product.id, { stock: newStock });
            }

            // Delete sale
            await this.firebaseRepo.delete(SALES_COLLECTION, id);

            // Emit events
            eventBus.emit(EVENTS.SALE_DELETED, id);
            eventBus.emit(EVENTS.DATA_CHANGED);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                errors: ['Error al eliminar la venta: ' + error.message]
            };
        }
    }

    /**
     * Get sales by product
     * @param {string} productId - Product ID
     * @returns {Promise<Array<Sale>>} Array of sales
     */
    async getSalesByProduct(productId) {
        try {
            const salesData = await this.firebaseRepo.query(
                SALES_COLLECTION,
                [['productId', '==', productId]]
            );
            return salesData.map(data => new Sale(data));
        } catch (error) {
            console.error('Error getting sales by product:', error);
            return [];
        }
    }

    /**
     * Get recent sales
     * @param {number} limit - Number of sales
     * @returns {Promise<Array<Sale>>} Array of recent sales
     */
    async getRecentSales(limit = 10) {
        try {
            const allSales = await this.getAllSales();
            return allSales
                .sort((a, b) => b.date - a.date)
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting recent sales:', error);
            return [];
        }
    }

    /**
     * Get sales for today
     * @returns {Promise<Array<Sale>>} Array of today's sales
     */
    async getTodaySales() {
        try {
            const allSales = await this.getAllSales();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return allSales.filter(sale => {
                const saleDate = new Date(sale.date);
                saleDate.setHours(0, 0, 0, 0);
                return saleDate.getTime() === today.getTime();
            });
        } catch (error) {
            console.error('Error getting today sales:', error);
            return [];
        }
    }

    /**
     * Get sales for current month
     * @returns {Promise<Array<Sale>>} Array of this month's sales
     */
    async getMonthSales() {
        try {
            const allSales = await this.getAllSales();
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            return allSales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === currentMonth &&
                    saleDate.getFullYear() === currentYear;
            });
        } catch (error) {
            console.error('Error getting month sales:', error);
            return [];
        }
    }

    /**
     * Calculate sale preview (before confirming)
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity
     * @returns {Promise<Object|null>} Sale preview or null
     */
    async calculateSalePreview(productId, quantity) {
        try {
            const product = await this.inventoryService.getProduct(productId);
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
        } catch (error) {
            console.error('Error calculating sale preview:', error);
            return null;
        }
    }
}

