# 🚀 Guía de Deployment y Base de Datos Gratuita

## 📊 Opciones de Base de Datos Gratuitas

### 1. **Supabase** ⭐ (RECOMENDADO)

**¿Por qué es la mejor opción?**
- ✅ Base de datos PostgreSQL gratuita
- ✅ 500 MB de almacenamiento
- ✅ API REST automática
- ✅ Autenticación incluida
- ✅ Tiempo real (real-time subscriptions)
- ✅ Dashboard visual muy fácil de usar

**Plan Gratuito:**
- 500 MB de base de datos
- 1 GB de transferencia mensual
- 50,000 usuarios activos mensuales
- 2 GB de almacenamiento de archivos

**Cómo empezar:**
```bash
# 1. Crear cuenta en https://supabase.com
# 2. Crear un nuevo proyecto
# 3. Obtener la URL y API Key
# 4. Instalar el cliente
npm install @supabase/supabase-js
```

**Ejemplo de integración:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tu-proyecto.supabase.co',
  'tu-api-key-publica'
)

// Guardar producto
async function addProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
  return data
}

// Obtener productos
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  return data
}
```

---

### 2. **Firebase (Google)** ⭐

**Ventajas:**
- ✅ Firestore (NoSQL) o Realtime Database
- ✅ Hosting incluido
- ✅ Autenticación de usuarios
- ✅ Muy bien documentado
- ✅ Escalable

**Plan Gratuito (Spark):**
- 1 GB de almacenamiento
- 10 GB de transferencia mensual
- 50,000 lecturas/día
- 20,000 escrituras/día

**Cómo empezar:**
```bash
# 1. Crear proyecto en https://firebase.google.com
# 2. Instalar Firebase
npm install firebase

# 3. Inicializar Firebase
npm install -g firebase-tools
firebase login
firebase init
```

**Ejemplo de integración:**
```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Guardar producto
async function addProduct(product) {
  const docRef = await addDoc(collection(db, "products"), product)
  return docRef.id
}

// Obtener productos
async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"))
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

---

### 3. **MongoDB Atlas**

**Ventajas:**
- ✅ Base de datos NoSQL
- ✅ 512 MB de almacenamiento gratuito
- ✅ Clusters compartidos
- ✅ Muy popular y bien documentado

**Plan Gratuito:**
- 512 MB de almacenamiento
- Clusters compartidos
- Sin límite de tiempo

**Cómo empezar:**
```bash
# 1. Crear cuenta en https://www.mongodb.com/cloud/atlas
# 2. Crear un cluster gratuito
# 3. Obtener connection string
# 4. Instalar driver
npm install mongodb
```

---

### 4. **PlanetScale**

**Ventajas:**
- ✅ MySQL compatible
- ✅ 5 GB de almacenamiento
- ✅ 1 billón de lecturas/mes
- ✅ Branching de base de datos

**Plan Gratuito:**
- 5 GB de almacenamiento
- 1 billón de lecturas/mes
- 10 millones de escrituras/mes

---

## 🌐 Opciones de Hosting Gratuito

### 1. **Vercel** ⭐ (RECOMENDADO PARA FRONTEND)

**Ventajas:**
- ✅ Deploy automático desde GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Dominio personalizado gratuito
- ✅ Serverless functions incluidas

**Plan Gratuito:**
- 100 GB de ancho de banda/mes
- Despliegues ilimitados
- Dominios personalizados

**Cómo deployar:**
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# O conectar con GitHub y deploy automático
```

---

### 2. **Netlify** ⭐

**Ventajas:**
- ✅ Deploy desde Git
- ✅ SSL automático
- ✅ Formularios incluidos
- ✅ Functions serverless
- ✅ Muy fácil de usar

**Plan Gratuito:**
- 100 GB de ancho de banda/mes
- 300 minutos de build/mes
- Dominios personalizados

**Cómo deployar:**
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy

# O arrastrar carpeta en netlify.com/drop
```

---

### 3. **GitHub Pages**

**Ventajas:**
- ✅ Totalmente gratuito
- ✅ Integrado con GitHub
- ✅ Ideal para sitios estáticos
- ✅ SSL incluido

**Limitaciones:**
- ⚠️ Solo sitios estáticos (HTML, CSS, JS)
- ⚠️ No soporta backend

**Cómo deployar:**
```bash
# 1. Crear repositorio en GitHub
# 2. Subir archivos
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main

# 3. Activar GitHub Pages en Settings > Pages
```

---

### 4. **Render**

**Ventajas:**
- ✅ Deploy de frontend y backend
- ✅ PostgreSQL gratuito (90 días)
- ✅ SSL automático
- ✅ Deploy desde Git

**Plan Gratuito:**
- Sitios estáticos ilimitados
- 750 horas de servicios web/mes
- PostgreSQL gratuito por 90 días

---

## 🎯 Mi Recomendación para Tu Aplicación

### **Opción 1: Supabase + Vercel** (LA MEJOR)

**Frontend:** Vercel  
**Backend/DB:** Supabase

**Ventajas:**
- ✅ Todo gratuito
- ✅ Muy fácil de configurar
- ✅ Escalable
- ✅ Base de datos SQL completa
- ✅ API REST automática

**Pasos:**
1. Crear proyecto en Supabase
2. Crear tablas para productos y ventas
3. Modificar tu `app.js` para usar Supabase en lugar de LocalStorage
4. Deploy en Vercel

---

### **Opción 2: Firebase** (TODO EN UNO)

**Frontend + Backend + DB:** Firebase

**Ventajas:**
- ✅ Todo en una plataforma
- ✅ Hosting + Base de datos incluidos
- ✅ Muy bien documentado
- ✅ Autenticación fácil

**Pasos:**
1. Crear proyecto en Firebase
2. Activar Firestore
3. Modificar tu `app.js` para usar Firestore
4. Deploy con `firebase deploy`

---

### **Opción 3: GitHub Pages + Supabase** (MÁS SIMPLE)

**Frontend:** GitHub Pages (gratis)  
**Backend/DB:** Supabase (gratis)

**Ventajas:**
- ✅ Súper simple
- ✅ No requiere CLI
- ✅ Solo necesitas Git

---

## 📝 Ejemplo: Migrar de LocalStorage a Supabase

### Paso 1: Crear tablas en Supabase

```sql
-- Tabla de productos
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ventas
CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP DEFAULT NOW()
);
```

### Paso 2: Modificar app.js

```javascript
// Agregar al inicio del archivo
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tu-proyecto.supabase.co',
  'tu-api-key-publica'
)

// Reemplazar función saveData()
async function saveData() {
  // Ya no es necesario, Supabase guarda automáticamente
}

// Reemplazar función initializeApp()
async function initializeApp() {
  // Cargar productos desde Supabase
  const { data: products } = await supabase
    .from('products')
    .select('*')
  
  inventory = products || []
  
  // Cargar ventas desde Supabase
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
  
  sales = sales || []
  
  updateAllViews()
}

// Modificar función de agregar producto
async function addProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  
  if (data) {
    inventory.push(data[0])
    updateAllViews()
  }
}

// Modificar función de agregar venta
async function addSale(sale) {
  const { data, error } = await supabase
    .from('sales')
    .insert([sale])
    .select()
  
  if (data) {
    sales.push(data[0])
    // Actualizar stock del producto
    await supabase
      .from('products')
      .update({ stock: product.stock - sale.quantity })
      .eq('id', sale.product_id)
    
    updateAllViews()
  }
}
```

---

## 🔥 Comparación Rápida

| Servicio | Base de Datos | Hosting | Facilidad | Escalabilidad |
|----------|---------------|---------|-----------|---------------|
| **Supabase + Vercel** | PostgreSQL | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Firebase** | NoSQL | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **MongoDB + Netlify** | NoSQL | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **GitHub Pages** | ❌ | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 Próximos Pasos

1. **Elige tu stack** (recomiendo Supabase + Vercel)
2. **Crea las cuentas** en los servicios elegidos
3. **Configura la base de datos** (crear tablas)
4. **Modifica el código** para usar la API
5. **Deploy** tu aplicación

---

> [!TIP]
> Si quieres que te ayude a implementar cualquiera de estas opciones, solo dime cuál prefieres y te creo el código modificado listo para usar.

> [!IMPORTANT]
> Todas estas opciones son **100% gratuitas** y no requieren tarjeta de crédito para empezar.
