# 👕 Shop Leo - Sistema de Inventario de Prendas

Sistema completo de gestión de inventario, ventas y ganancias para tiendas de ropa, con Firebase como base de datos en la nube.

## 🚀 Características

- ✅ **Gestión de Inventario**: Agregar, editar y eliminar productos
- ✅ **Registro de Ventas**: Procesar ventas con actualización automática de stock
- ✅ **Análisis de Ganancias**: Cálculos automáticos de rentabilidad
- ✅ **Dashboard en Tiempo Real**: Estadísticas y métricas actualizadas
- ✅ **Base de Datos en la Nube**: Firebase Firestore para persistencia de datos
- ✅ **Hosting Gratuito**: Desplegado en Firebase Hosting

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura**: MVC con Repository Pattern
- **Base de Datos**: Firebase Firestore (NoSQL)
- **Hosting**: Firebase Hosting
- **Región**: South America East 1 (São Paulo)

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd projectShop
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

Sigue la guía completa en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para:
- Crear proyecto en Firebase Console
- Configurar Firestore Database
- Obtener credenciales
- Actualizar `src/config/firebase-config.js`

### 4. Ejecutar Localmente

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5000`

### 5. Desplegar a Producción

```bash
npm run deploy
```

## 📁 Estructura del Proyecto

```
projectShop/
├── src/
│   ├── config/
│   │   ├── constants.js          # Constantes de la aplicación
│   │   └── firebase-config.js    # Configuración de Firebase
│   ├── models/
│   │   ├── Product.js            # Modelo de Producto
│   │   └── Sale.js               # Modelo de Venta
│   ├── repositories/
│   │   ├── FirebaseRepository.js # Repositorio de Firebase (CRUD)
│   │   ├── ProductRepository.js  # Repositorio de Productos (Legacy)
│   │   └── SaleRepository.js     # Repositorio de Ventas (Legacy)
│   ├── services/
│   │   ├── InventoryService.js   # Lógica de negocio de inventario
│   │   ├── SalesService.js       # Lógica de negocio de ventas
│   │   └── AnalyticsService.js   # Lógica de análisis y estadísticas
│   ├── views/
│   │   ├── DashboardView.js      # Vista del Dashboard
│   │   ├── InventoryView.js      # Vista de Inventario
│   │   ├── SalesView.js          # Vista de Ventas
│   │   └── ProfitsView.js        # Vista de Ganancias
│   ├── utils/
│   │   ├── EventEmitter.js       # Sistema de eventos
│   │   ├── formatters.js         # Funciones de formato
│   │   └── validators.js         # Validaciones
│   ├── components/
│   │   └── ModalManager.js       # Gestión de modales
│   └── main.js                   # Punto de entrada
├── index.html                    # HTML principal
├── styles.css                    # Estilos CSS
├── firebase.json                 # Configuración de Firebase
├── firestore.rules               # Reglas de seguridad de Firestore
├── firestore.indexes.json        # Índices de Firestore
├── package.json                  # Dependencias del proyecto
├── FIREBASE_SETUP.md             # Guía de configuración de Firebase
├── DEPLOYMENT_GUIDE.md           # Guía de deployment (legacy)
└── README.md                     # Este archivo
```

## 🔥 Firebase

### Colecciones de Firestore

#### `products`
```javascript
{
  id: string,
  name: string,
  category: string,
  stock: number,
  cost: number,
  price: number,
  createdAt: timestamp
}
```

#### `sales`
```javascript
{
  id: string,
  productId: string,
  productName: string,
  quantity: number,
  price: number,
  cost: number,
  saleDate: timestamp
}
```

### Reglas de Seguridad

Actualmente en **modo de prueba** (acceso público). Para producción, actualiza `firestore.rules`.

## 📝 Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Desplegar todo (hosting + firestore)
npm run deploy

# Solo desplegar hosting
npm run deploy:hosting

# Solo desplegar reglas de Firestore
npm run deploy:firestore

# Ver logs
npm run logs
```

## 🎨 Características de la UI

- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Feedback Visual**: Indicadores de carga y mensajes de éxito/error
- **Tema Oscuro**: Colores vibrantes con gradientes

## 🔐 Seguridad

> [!WARNING]
> Las reglas de Firestore actuales están en **modo de prueba** y permiten acceso público.
> Antes de lanzar a producción, actualiza las reglas en `firestore.rules`.

## 📊 Funcionalidades

### Dashboard
- Total de inventario
- Ventas totales
- Ganancias netas
- Margen promedio
- Productos más vendidos
- Ventas recientes

### Inventario
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos
- Visualizar stock disponible
- Alertas de stock bajo

### Ventas
- Registrar nuevas ventas
- Actualización automática de stock
- Cálculo automático de ganancias
- Historial de ventas

### Ganancias
- Resumen financiero
- Ganancias por categoría
- Productos por rentabilidad
- Margen de ganancia

## 🌐 URL de Producción

Una vez desplegado, tu aplicación estará disponible en:
```
https://shop-leo.web.app
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👨‍💻 Autor

Shop Leo - Sistema de Inventario

---

**¿Necesitas ayuda?** Consulta [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para instrucciones detalladas de configuración.