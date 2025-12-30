// ========================================
// Product Repository
// ========================================

import { BaseRepository } from './BaseRepository.js';
import { Product } from '../models/Product.js';
import { STORAGE_KEYS } from '../config/constants.js';

export class ProductRepository extends BaseRepository {
    constructor() {
        super(STORAGE_KEYS.PRODUCTS);
    }

    /**
     * Get all products as Product instances
     * @returns {Array<Product>} Array of Product instances
     */
    getAll() {
        const data = super.getAll();
        return data.map(item => Product.fromJSON(item));
    }

    /**
     * Get product by ID as Product instance
     * @param {number} id - Product ID
     * @returns {Product|null} Product instance or null
     */
    getById(id) {
        const data = super.getById(id);
        return data ? Product.fromJSON(data) : null;
    }

    /**
     * Create a new product
     * @param {Product} product - Product instance
     * @returns {Product} Created product
     */
    create(product) {
        const data = super.create(product.toJSON());
        return Product.fromJSON(data);
    }

    /**
     * Update a product
     * @param {number} id - Product ID
     * @param {Object} updates - Updates to apply
     * @returns {Product|null} Updated product or null
     */
    update(id, updates) {
        const data = super.update(id, updates);
        return data ? Product.fromJSON(data) : null;
    }

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Array<Product>} Array of products
     */
    getByCategory(category) {
        return this.getAll().filter(product => product.category === category);
    }

    /**
     * Get products with low stock
     * @returns {Array<Product>} Array of products with low stock
     */
    getLowStock() {
        return this.getAll().filter(product => product.isLowStock());
    }

    /**
     * Get products out of stock
     * @returns {Array<Product>} Array of out of stock products
     */
    getOutOfStock() {
        return this.getAll().filter(product => !product.isInStock());
    }

    /**
     * Search products by name
     * @param {string} query - Search query
     * @returns {Array<Product>} Array of matching products
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAll().filter(product =>
            product.name.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Update product stock
     * @param {number} id - Product ID
     * @param {number} quantity - New stock quantity
     * @returns {Product|null} Updated product or null
     */
    updateStock(id, quantity) {
        return this.update(id, { stock: quantity });
    }

    /**
     * Reduce product stock
     * @param {number} id - Product ID
     * @param {number} quantity - Quantity to reduce
     * @returns {Product|null} Updated product or null
     */
    reduceStock(id, quantity) {
        const product = this.getById(id);
        if (!product || !product.reduceStock(quantity)) {
            return null;
        }
        return this.update(id, { stock: product.stock });
    }

    /**
     * Initialize with sample data
     * @returns {Array<Product>} Array of created products
     */
    initializeSampleData() {
        const sampleProducts = [
            {
                name: 'Camiseta Básica Blanca',
                category: 'Camisetas',
                stock: 45,
                cost: 8.50,
                price: 19.99
            },
            {
                name: 'Jeans Slim Fit',
                category: 'Pantalones',
                stock: 28,
                cost: 25.00,
                price: 59.99
            },
            {
                name: 'Vestido Floral Verano',
                category: 'Vestidos',
                stock: 15,
                cost: 30.00,
                price: 79.99
            },
            {
                name: 'Chaqueta de Cuero',
                category: 'Chaquetas',
                stock: 8,
                cost: 80.00,
                price: 199.99
            },
            {
                name: 'Bufanda de Lana',
                category: 'Accesorios',
                stock: 32,
                cost: 12.00,
                price: 29.99
            },
            {
                name: 'Camiseta Estampada',
                category: 'Camisetas',
                stock: 52,
                cost: 10.00,
                price: 24.99
            },
            {
                name: 'Pantalón Deportivo',
                category: 'Pantalones',
                stock: 38,
                cost: 18.00,
                price: 44.99
            },
            {
                name: 'Vestido de Noche',
                category: 'Vestidos',
                stock: 6,
                cost: 60.00,
                price: 149.99
            }
        ];

        return sampleProducts.map(data => this.create(new Product(data)));
    }
}
