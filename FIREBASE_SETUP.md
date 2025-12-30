# 🔥 Guía de Configuración de Firebase

Esta guía te llevará paso a paso para configurar Firebase en tu proyecto **shop-leo**.

---

## 📋 Requisitos Previos

- Una cuenta de Google
- Node.js instalado (versión 16 o superior)
- Git instalado

---

## Paso 1: Crear Proyecto en Firebase Console

### 1.1 Acceder a Firebase Console

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Agregar proyecto"** o **"Add project"**

### 1.2 Configurar el Proyecto

1. **Nombre del proyecto**: Ingresa `shop-leo`
2. Haz clic en **Continuar**
3. **Google Analytics**: Puedes desactivarlo por ahora (opcional)
4. Haz clic en **Crear proyecto**
5. Espera a que se cree el proyecto (puede tomar 30-60 segundos)
6. Haz clic en **Continuar**

---

## Paso 2: Configurar Firestore Database

### 2.1 Crear Base de Datos

1. En el menú lateral, haz clic en **"Compilación"** > **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. **Ubicación**: Selecciona `southamerica-east1 (São Paulo)`
4. Haz clic en **Siguiente**

### 2.2 Configurar Reglas de Seguridad

1. Selecciona **"Comenzar en modo de prueba"** (test mode)
2. Haz clic en **Habilitar**
3. Espera a que se cree la base de datos

> [!WARNING]
> **Modo de Prueba**: Las reglas en modo de prueba permiten acceso público a tu base de datos.
> Esto es útil para desarrollo, pero deberás cambiar las reglas antes de lanzar a producción.

---

## Paso 3: Obtener Credenciales de Firebase

### 3.1 Registrar Aplicación Web

1. En la página principal del proyecto, haz clic en el ícono **Web** (`</>`)
2. **Nombre de la app**: Ingresa `shop-leo-web`
3. **NO** marques "También configurar Firebase Hosting" (lo haremos después)
4. Haz clic en **Registrar app**

### 3.2 Copiar Configuración

1. Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "shop-leo.firebaseapp.com",
  projectId: "shop-leo",
  storageBucket: "shop-leo.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

2. **COPIA** estos valores
3. Haz clic en **Continuar a la consola**

### 3.3 Actualizar firebase-config.js

1. Abre el archivo `src/config/firebase-config.js`
2. Reemplaza los valores de `firebaseConfig` con los que copiaste:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "shop-leo.firebaseapp.com",
  projectId: "shop-leo",
  storageBucket: "shop-leo.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

3. Guarda el archivo

---

## Paso 4: Instalar Dependencias

### 4.1 Instalar Firebase SDK

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará:
- `firebase` (SDK de Firebase)
- `firebase-tools` (CLI de Firebase)

### 4.2 Verificar Instalación

```bash
npm list firebase
```

Deberías ver algo como:
```
shop-leo@1.0.0
└── firebase@10.7.1
```

---

## Paso 5: Configurar Firebase CLI

### 5.1 Instalar Firebase Tools Globalmente (opcional)

```bash
npm install -g firebase-tools
```

### 5.2 Iniciar Sesión

```bash
firebase login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Google.

### 5.3 Verificar Proyecto

```bash
firebase projects:list
```

Deberías ver tu proyecto `shop-leo` en la lista.

---

## Paso 6: Inicializar Firebase en el Proyecto

### 6.1 Inicializar Firebase

```bash
firebase init
```

### 6.2 Seleccionar Servicios

Usa las flechas y la barra espaciadora para seleccionar:
- ✅ **Firestore**: Configure security rules and indexes files for Firestore
- ✅ **Hosting**: Configure files for Firebase Hosting

Presiona **Enter**

### 6.3 Configurar Firestore

1. **What file should be used for Firestore Rules?**
   - Presiona Enter (usar `firestore.rules`)

2. **What file should be used for Firestore indexes?**
   - Presiona Enter (usar `firestore.indexes.json`)

### 6.4 Configurar Hosting

1. **What do you want to use as your public directory?**
   - Escribe `.` (punto) y presiona Enter

2. **Configure as a single-page app?**
   - Escribe `y` y presiona Enter

3. **Set up automatic builds and deploys with GitHub?**
   - Escribe `n` y presiona Enter

4. **File ./index.html already exists. Overwrite?**
   - Escribe `n` y presiona Enter (NO sobrescribir)

---

## Paso 7: Desplegar Reglas de Firestore

```bash
firebase deploy --only firestore:rules
```

Esto desplegará las reglas de seguridad que ya están configuradas en `firestore.rules`.

---

## Paso 8: Probar Localmente

### 8.1 Iniciar Servidor Local

```bash
npm run dev
```

O directamente:

```bash
firebase serve
```

### 8.2 Abrir en el Navegador

1. Abre tu navegador en `http://localhost:5000`
2. Verifica que la aplicación cargue correctamente
3. Intenta agregar un producto
4. Verifica en Firebase Console > Firestore Database que se creó el documento

---

## Paso 9: Desplegar a Producción

### 9.1 Deploy Completo

```bash
npm run deploy
```

O directamente:

```bash
firebase deploy
```

### 9.2 Verificar Deployment

Al finalizar, verás un mensaje como:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/shop-leo/overview
Hosting URL: https://shop-leo.web.app
```

### 9.3 Acceder a tu Aplicación

1. Abre la **Hosting URL** en tu navegador
2. Tu aplicación ahora está en producción! 🎉

---

## 📊 Verificar en Firebase Console

### Firestore Database

1. Ve a **Firestore Database** en la consola
2. Deberías ver las colecciones:
   - `products`
   - `sales`

### Hosting

1. Ve a **Hosting** en la consola
2. Verás tu dominio: `shop-leo.web.app`
3. También puedes configurar un dominio personalizado aquí

---

## 🔒 Actualizar Reglas de Seguridad (Producción)

> [!CAUTION]
> **Importante**: Las reglas actuales permiten acceso público. Para producción, deberías:

### Opción 1: Reglas Básicas (Solo Lectura Pública)

Edita `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Solo administradores
    }
    
    match /sales/{saleId} {
      allow read: if true;
      allow write: if false; // Solo administradores
    }
  }
}
```

### Opción 2: Con Autenticación

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
    
    match /sales/{saleId} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

Después de editar, despliega las nuevas reglas:

```bash
firebase deploy --only firestore:rules
```

---

## 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
firebase functions:log

# Solo desplegar hosting
npm run deploy:hosting

# Solo desplegar reglas de Firestore
npm run deploy:firestore

# Ver información del proyecto
firebase projects:list

# Cambiar de proyecto
firebase use <project-id>

# Abrir consola de Firebase
firebase open
```

---

## 🐛 Solución de Problemas

### Error: "Firebase not initialized"

- Verifica que hayas copiado correctamente las credenciales en `firebase-config.js`
- Asegúrate de que `npm install` se haya ejecutado correctamente

### Error: "Permission denied"

- Verifica las reglas de seguridad en Firestore
- Asegúrate de estar en modo de prueba o tener las reglas correctas

### Error: "Module not found"

- Ejecuta `npm install` nuevamente
- Verifica que el archivo `package.json` exista

### La aplicación no carga en producción

- Verifica que el deployment haya sido exitoso
- Revisa la consola del navegador para ver errores
- Verifica que las credenciales de Firebase sean correctas

---

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Guía de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Reglas de Seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)

---

## ✅ Checklist de Configuración

- [ ] Crear proyecto en Firebase Console
- [ ] Configurar Firestore Database (región: southamerica-east1)
- [ ] Obtener credenciales de configuración
- [ ] Actualizar `src/config/firebase-config.js` con credenciales reales
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `firebase login`
- [ ] Ejecutar `firebase init`
- [ ] Desplegar reglas: `firebase deploy --only firestore:rules`
- [ ] Probar localmente: `npm run dev`
- [ ] Desplegar a producción: `npm run deploy`
- [ ] Verificar aplicación en la URL de hosting

---

> [!TIP]
> **Próximo Paso**: Una vez que completes esta configuración, tu aplicación estará lista para usar.
> Puedes agregar productos y ventas, y los datos se sincronizarán automáticamente con Firebase!
