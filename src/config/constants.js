// ========================================
// Configuration Constants
// ========================================

export const STORAGE_KEYS = {
    PRODUCTS: 'inventory_products',
    SALES: 'inventory_sales'
};

export const CATEGORIES = [
    'Camisetas',
    'Pantalones',
    'Vestidos',
    'Chaquetas',
    'Accesorios'
];

export const STOCK_LEVELS = {
    HIGH: 30,
    MEDIUM: 10,
    LOW: 0
};

export const EVENTS = {
    PRODUCT_ADDED: 'product:added',
    PRODUCT_UPDATED: 'product:updated',
    PRODUCT_DELETED: 'product:deleted',
    SALE_ADDED: 'sale:added',
    SALE_DELETED: 'sale:deleted',
    DATA_CHANGED: 'data:changed'
};

export const VIEWS = {
    DASHBOARD: 'dashboard',
    INVENTORY: 'inventory',
    SALES: 'sales',
    PROFITS: 'profits'
};
