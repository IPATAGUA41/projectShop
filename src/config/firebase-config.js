import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para el proyecto "shop-leo"
// IMPORTANTE: Después de crear el proyecto en Firebase Console,
// reemplaza estos valores con tus credenciales reales
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "shop-leo.firebaseapp.com",
    projectId: "shop-leo",
    storageBucket: "shop-leo.firebasestorage.app",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore con configuración para región southamerica-east1
const db = getFirestore(app);

export { db, app };
