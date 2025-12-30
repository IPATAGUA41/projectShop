// ========================================
// Base Repository - Repository Pattern
// ========================================

export class BaseRepository {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    /**
     * Get all items from storage
     * @returns {Array} Array of items
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading from ${this.storageKey}:`, error);
            return [];
        }
    }

    /**
     * Get item by ID
     * @param {number} id - Item ID
     * @returns {Object|null} Item or null if not found
     */
    getById(id) {
        const items = this.getAll();
        return items.find(item => item.id === id) || null;
    }

    /**
     * Save all items to storage
     * @param {Array} items - Array of items
     */
    saveAll(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        } catch (error) {
            console.error(`Error saving to ${this.storageKey}:`, error);
            throw new Error('Failed to save data');
        }
    }

    /**
     * Create a new item
     * @param {Object} item - Item to create
     * @returns {Object} Created item
     */
    create(item) {
        const items = this.getAll();
        const newItem = {
            ...item,
            id: item.id || Date.now()
        };
        items.push(newItem);
        this.saveAll(items);
        return newItem;
    }

    /**
     * Update an existing item
     * @param {number} id - Item ID
     * @param {Object} updates - Updates to apply
     * @returns {Object|null} Updated item or null if not found
     */
    update(id, updates) {
        const items = this.getAll();
        const index = items.findIndex(item => item.id === id);

        if (index === -1) return null;

        items[index] = { ...items[index], ...updates };
        this.saveAll(items);
        return items[index];
    }

    /**
     * Delete an item
     * @param {number} id - Item ID
     * @returns {boolean} True if deleted
     */
    delete(id) {
        const items = this.getAll();
        const filteredItems = items.filter(item => item.id !== id);

        if (filteredItems.length === items.length) return false;

        this.saveAll(filteredItems);
        return true;
    }

    /**
     * Delete all items
     */
    deleteAll() {
        this.saveAll([]);
    }

    /**
     * Count total items
     * @returns {number} Total count
     */
    count() {
        return this.getAll().length;
    }

    /**
     * Check if item exists
     * @param {number} id - Item ID
     * @returns {boolean} True if exists
     */
    exists(id) {
        return this.getById(id) !== null;
    }
}
