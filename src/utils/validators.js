// ========================================
// Validators - Validation Functions
// ========================================

/**
 * Validate if a value is not empty
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isRequired(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
}

/**
 * Validate if a value is a positive number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
}

/**
 * Validate if a value is a positive integer
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isPositiveInteger(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
}

/**
 * Validate if a price is valid
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isValidPrice(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
}

/**
 * Validate if stock is sufficient
 * @param {number} available - Available stock
 * @param {number} requested - Requested quantity
 * @returns {boolean} True if sufficient
 */
export function hasSufficientStock(available, requested) {
    return available >= requested;
}

/**
 * Validate product data
 * @param {Object} product - Product object
 * @returns {Object} Validation result with isValid and errors
 */
export function validateProduct(product) {
    const errors = [];

    if (!isRequired(product.name)) {
        errors.push('El nombre del producto es requerido');
    }

    if (!isRequired(product.category)) {
        errors.push('La categoría es requerida');
    }

    if (!isPositiveInteger(product.stock)) {
        errors.push('El stock debe ser un número entero positivo');
    }

    if (!isValidPrice(product.cost)) {
        errors.push('El costo debe ser un número positivo');
    }

    if (!isValidPrice(product.price)) {
        errors.push('El precio debe ser un número positivo');
    }

    if (product.cost && product.price && Number(product.cost) >= Number(product.price)) {
        errors.push('El precio de venta debe ser mayor que el costo');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate sale data
 * @param {Object} sale - Sale object
 * @param {number} availableStock - Available stock
 * @returns {Object} Validation result with isValid and errors
 */
export function validateSale(sale, availableStock) {
    const errors = [];

    if (!isRequired(sale.productId)) {
        errors.push('Debe seleccionar un producto');
    }

    if (!isPositiveInteger(sale.quantity)) {
        errors.push('La cantidad debe ser un número entero positivo');
    }

    if (sale.quantity && !hasSufficientStock(availableStock, sale.quantity)) {
        errors.push(`Stock insuficiente. Solo hay ${availableStock} unidades disponibles`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
