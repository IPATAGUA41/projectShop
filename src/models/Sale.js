// ========================================
// Sale Model
// ========================================

export class Sale {
    constructor(data) {
        this.id = data.id || Date.now();
        this.productId = data.productId;
        this.productName = data.productName;
        this.quantity = Number(data.quantity);
        this.price = Number(data.price);
        this.cost = Number(data.cost);
        this.date = data.date || new Date();
    }

    /**
     * Calculate total sale amount
     * @returns {number} Total amount
     */
    getTotal() {
        return this.price * this.quantity;
    }

    /**
     * Calculate total cost
     * @returns {number} Total cost
     */
    getTotalCost() {
        return this.cost * this.quantity;
    }

    /**
     * Calculate profit from this sale
     * @returns {number} Profit amount
     */
    getProfit() {
        return this.getTotal() - this.getTotalCost();
    }

    /**
     * Calculate profit margin percentage
     * @returns {number} Margin percentage
     */
    getMargin() {
        const total = this.getTotal();
        if (total === 0) return 0;
        return ((this.getProfit() / total) * 100);
    }

    /**
     * Get profit per unit
     * @returns {number} Profit per unit
     */
    getProfitPerUnit() {
        return this.price - this.cost;
    }

    /**
     * Convert to plain object for storage
     * @returns {Object} Plain object
     */
    toJSON() {
        return {
            id: this.id,
            productId: this.productId,
            productName: this.productName,
            quantity: this.quantity,
            price: this.price,
            cost: this.cost,
            date: this.date
        };
    }

    /**
     * Create Sale instance from plain object
     * @param {Object} data - Plain object
     * @returns {Sale} Sale instance
     */
    static fromJSON(data) {
        return new Sale({
            ...data,
            date: new Date(data.date)
        });
    }
}
