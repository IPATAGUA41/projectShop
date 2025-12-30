import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

/**
 * Repositorio para manejar todas las operaciones de Firestore
 * Proporciona una capa de abstracción sobre Firebase Firestore
 */
class FirebaseRepository {
    /**
     * Obtener todos los documentos de una colección
     * @param {string} collectionName - Nombre de la colección
     * @returns {Promise<Array>} Array de documentos
     */
    async getAll(collectionName) {
        try {
            const collectionRef = collection(db, collectionName);
            const querySnapshot = await getDocs(collectionRef);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convertir Timestamps de Firestore a Date
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                saleDate: doc.data().saleDate?.toDate?.() || null
            }));
        } catch (error) {
            console.error(`Error al obtener documentos de ${collectionName}:`, error);
            throw new Error(`No se pudieron cargar los datos de ${collectionName}`);
        }
    }

    /**
     * Obtener un documento por ID
     * @param {string} collectionName - Nombre de la colección
     * @param {string} id - ID del documento
     * @returns {Promise<Object|null>} Documento o null si no existe
     */
    async getById(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
                    saleDate: docSnap.data().saleDate?.toDate?.() || null
                };
            }
            return null;
        } catch (error) {
            console.error(`Error al obtener documento ${id} de ${collectionName}:`, error);
            throw new Error(`No se pudo cargar el documento`);
        }
    }

    /**
     * Crear un nuevo documento
     * @param {string} collectionName - Nombre de la colección
     * @param {Object} data - Datos del documento
     * @returns {Promise<Object>} Documento creado con su ID
     */
    async create(collectionName, data) {
        try {
            const collectionRef = collection(db, collectionName);

            // Agregar timestamp de creación
            const dataWithTimestamp = {
                ...data,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collectionRef, dataWithTimestamp);

            // Retornar el documento con su ID
            return {
                id: docRef.id,
                ...data,
                createdAt: new Date()
            };
        } catch (error) {
            console.error(`Error al crear documento en ${collectionName}:`, error);
            throw new Error(`No se pudo crear el documento`);
        }
    }

    /**
     * Actualizar un documento existente
     * @param {string} collectionName - Nombre de la colección
     * @param {string} id - ID del documento
     * @param {Object} updates - Datos a actualizar
     * @returns {Promise<Object>} Documento actualizado
     */
    async update(collectionName, id, updates) {
        try {
            const docRef = doc(db, collectionName, id);

            // Agregar timestamp de actualización
            const updatesWithTimestamp = {
                ...updates,
                updatedAt: serverTimestamp()
            };

            await updateDoc(docRef, updatesWithTimestamp);

            // Retornar el documento actualizado
            return {
                id,
                ...updates,
                updatedAt: new Date()
            };
        } catch (error) {
            console.error(`Error al actualizar documento ${id} en ${collectionName}:`, error);
            throw new Error(`No se pudo actualizar el documento`);
        }
    }

    /**
     * Eliminar un documento
     * @param {string} collectionName - Nombre de la colección
     * @param {string} id - ID del documento
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    async delete(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error(`Error al eliminar documento ${id} de ${collectionName}:`, error);
            throw new Error(`No se pudo eliminar el documento`);
        }
    }

    /**
     * Realizar una consulta personalizada
     * @param {string} collectionName - Nombre de la colección
     * @param {Array} filters - Array de filtros [campo, operador, valor]
     * @param {string} orderByField - Campo por el cual ordenar (opcional)
     * @returns {Promise<Array>} Array de documentos que cumplen los filtros
     */
    async query(collectionName, filters = [], orderByField = null) {
        try {
            const collectionRef = collection(db, collectionName);
            let q = collectionRef;

            // Aplicar filtros
            if (filters.length > 0) {
                const constraints = filters.map(([field, operator, value]) =>
                    where(field, operator, value)
                );
                q = query(collectionRef, ...constraints);
            }

            // Aplicar ordenamiento
            if (orderByField) {
                q = query(q, orderBy(orderByField));
            }

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                saleDate: doc.data().saleDate?.toDate?.() || null
            }));
        } catch (error) {
            console.error(`Error al consultar ${collectionName}:`, error);
            throw new Error(`No se pudo realizar la consulta`);
        }
    }

    /**
     * Contar documentos en una colección
     * @param {string} collectionName - Nombre de la colección
     * @returns {Promise<number>} Cantidad de documentos
     */
    async count(collectionName) {
        try {
            const docs = await this.getAll(collectionName);
            return docs.length;
        } catch (error) {
            console.error(`Error al contar documentos de ${collectionName}:`, error);
            return 0;
        }
    }
}

// Exportar una instancia única del repositorio (Singleton)
export default new FirebaseRepository();
