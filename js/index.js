// Array de productos - iPhones con TODAS las combinaciones
const products = generateiPhoneProducts();

function generateiPhoneProducts() {
    const models = [
        { name: "iPhone 8", basePrice: 299 },
        { name: "iPhone 8 Plus", basePrice: 399 },
        { name: "iPhone X", basePrice: 599 },
        { name: "iPhone XR", basePrice: 499 },
        { name: "iPhone XS", basePrice: 699 },
        { name: "iPhone XS Max", basePrice: 899 },
        { name: "iPhone 11", basePrice: 599 },
        { name: "iPhone 11 Pro", basePrice: 899 },
        { name: "iPhone 11 Pro Max", basePrice: 1099 },
        { name: "iPhone 12", basePrice: 699 },
        { name: "iPhone 12 mini", basePrice: 749 },
        { name: "iPhone 12 Pro", basePrice: 999 },
        { name: "iPhone 12 Pro Max", basePrice: 1199 },
        { name: "iPhone 13", basePrice: 799 },
        { name: "iPhone 13 mini", basePrice: 849 },
        { name: "iPhone 13 Pro", basePrice: 1299 },
        { name: "iPhone 13 Pro Max", basePrice: 1399 },
        { name: "iPhone 14", basePrice: 899 },
        { name: "iPhone 14 Plus", basePrice: 1099 },
        { name: "iPhone 14 Pro", basePrice: 1499 },
        { name: "iPhone 14 Pro Max", basePrice: 1599 },
        { name: "iPhone 15", basePrice: 999 },
        { name: "iPhone 15 Plus", basePrice: 1199 },
        { name: "iPhone 15 Pro", basePrice: 1699 },
        { name: "iPhone 15 Pro Max", basePrice: 1799 },
        { name: "iPhone 16", basePrice: 1099 },
        { name: "iPhone 16 Plus", basePrice: 1299 },
        { name: "iPhone 16 Pro", basePrice: 1799 },
        { name: "iPhone 16 Pro Max", basePrice: 1899 }
    ];

    const colors = ["blanco", "negro"];
    const storages = [128, 256, 512];
    const productsArray = [];
    let id = 1;

    // Generar TODAS las combinaciones para cada modelo
    models.forEach(model => {
        colors.forEach(color => {
            storages.forEach(storage => {
                // Calcular precio: precio base + extra por almacenamiento
                let price = model.basePrice;
                if (storage === 256) price += 100;
                if (storage === 512) price += 200;
                
                // ↓↓↓↓ LÍNEA MÁGICA - GENERA NOMBRE AUTOMÁTICO ↓↓↓↓
                const imageName = `iphone-${model.name.toLowerCase().replace(/ /g, '-').replace('iphone-', '')}-${color}.jpg`;
                
                productsArray.push({
                    id: id++,
                    name: model.name,
                    model: model.name.replace('iPhone ', ''),
                    color: color,
                    storage: storage,
                    price: price,
                    // ↓↓↓↓ RUTA COMPLETA DE LA IMAGEN ↓↓↓↓
                    image: `images/${imageName}`
                });
            });
        });
    });

    return productsArray;
}

// Elementos DOM
let productsContainer;
let filterModal;
let filterToggle;
let closeModal;
let filterForm;
let clearFiltersBtn;
let priceRange;
let priceValue;

// Estado de filtros
let currentFilters = {
    model: '',
    color: '',
    storage: '',
    priceRange: 2000
};

// Inicializar la aplicación
function init() {
    // Obtener elementos DOM después de que se cargue la estructura
    productsContainer = document.getElementById('productsContainer');
    filterToggle = document.getElementById('filterToggle');
    
    // Crear y configurar el modal con JavaScript
    createModal();
    
    // Obtener referencias a los elementos del modal recién creado
    filterModal = document.getElementById('filterModal');
    closeModal = document.querySelector('.close');
    filterForm = document.getElementById('filterForm');
    clearFiltersBtn = document.getElementById('clearFilters');
    priceRange = document.getElementById('priceRange');
    priceValue = document.getElementById('priceValue');
    
    // Pintar todos los productos al cargar
    renderProducts(products);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar valor del rango de precio
    updatePriceValue();
}

// Crear el modal con JavaScript
function createModal() {
    const modalHTML = `
        <div id="filterModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Filtrar iPhones</h2>
                
                <form id="filterForm">
                    <!-- Filtro por modelo -->
                    <div class="form-group">
                        <label for="model">Modelo:</label>
                        <select id="model" name="model">
                            <option value="">Todos los modelos</option>
                            <option value="8">iPhone 8</option>
                            <option value="8 Plus">iPhone 8 Plus</option>
                            <option value="X">iPhone X</option>
                            <option value="XR">iPhone XR</option>
                            <option value="XS">iPhone XS</option>
                            <option value="XS Max">iPhone XS Max</option>
                            <option value="11">iPhone 11</option>
                            <option value="11 Pro">iPhone 11 Pro</option>
                            <option value="11 Pro Max">iPhone 11 Pro Max</option>
                            <option value="12">iPhone 12</option>
                            <option value="12 mini">iPhone 12 mini</option>
                            <option value="12 Pro">iPhone 12 Pro</option>
                            <option value="12 Pro Max">iPhone 12 Pro Max</option>
                            <option value="13">iPhone 13</option>
                            <option value="13 mini">iPhone 13 mini</option>
                            <option value="13 Pro">iPhone 13 Pro</option>
                            <option value="13 Pro Max">iPhone 13 Pro Max</option>
                            <option value="14">iPhone 14</option>
                            <option value="14 Plus">iPhone 14 Plus</option>
                            <option value="14 Pro">iPhone 14 Pro</option>
                            <option value="14 Pro Max">iPhone 14 Pro Max</option>
                            <option value="15">iPhone 15</option>
                            <option value="15 Plus">iPhone 15 Plus</option>
                            <option value="15 Pro">iPhone 15 Pro</option>
                            <option value="15 Pro Max">iPhone 15 Pro Max</option>
                            <option value="16">iPhone 16</option>
                            <option value="16 Plus">iPhone 16 Plus</option>
                            <option value="16 Pro">iPhone 16 Pro</option>
                            <option value="16 Pro Max">iPhone 16 Pro Max</option>
                        </select>
                    </div>
                    
                    <!-- Filtro por color -->
                    <div class="form-group">
                        <label for="color">Color:</label>
                        <select id="color" name="color">
                            <option value="">Todos los colores</option>
                            <option value="blanco">Blanco</option>
                            <option value="negro">Negro</option>
                        </select>
                    </div>
                    
                    <!-- Filtro por almacenamiento -->
                    <div class="form-group">
                        <label for="storage">Almacenamiento:</label>
                        <select id="storage" name="storage">
                            <option value="">Todos los almacenamientos</option>
                            <option value="128">128GB</option>
                            <option value="256">256GB</option>
                            <option value="512">512GB</option>
                        </select>
                    </div>
                    
                    <!-- Filtro por precio -->
                    <div class="form-group">
                        <label for="priceRange">Precio máximo: <span id="priceValue">€2000</span></label>
                        <input type="range" id="priceRange" name="priceRange" min="0" max="2000" value="2000" step="50">
                    </div>
                    
                    <!-- Botones -->
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary">Aplicar Filtros</button>
                        <button type="button" id="clearFilters" class="btn btn-secondary">Limpiar Filtros</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Abrir modal de filtros
    filterToggle.addEventListener('click', () => {
        filterModal.style.display = 'block';
    });
    
    // Cerrar modal de filtros
    closeModal.addEventListener('click', () => {
        filterModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
    
    // Aplicar filtros al enviar el formulario
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
        filterModal.style.display = 'none';
    });
    
    // Limpiar filtros
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Actualizar valor visual del rango de precio
    priceRange.addEventListener('input', updatePriceValue);
}

// Actualizar el valor visual del rango de precio
function updatePriceValue() {
    priceValue.textContent = `€${priceRange.value}`;
    currentFilters.priceRange = parseInt(priceRange.value);
}

// Aplicar filtros a los productos
function applyFilters() {
    // Obtener valores del formulario
    const model = document.getElementById('model').value;
    const color = document.getElementById('color').value;
    const storage = document.getElementById('storage').value;
    const maxPrice = parseInt(priceRange.value);
    
    // Actualizar estado de filtros
    currentFilters.model = model;
    currentFilters.color = color;
    currentFilters.storage = storage;
    currentFilters.priceRange = maxPrice;
    
    // Filtrar productos
    const filteredProducts = products.filter(product => {
        // Filtro por modelo
        const modelMatch = !model || product.model === model;
        
        // Filtro por color
        const colorMatch = !color || product.color === color;
        
        // Filtro por almacenamiento
        const storageMatch = !storage || product.storage === parseInt(storage);
        
        // Filtro por precio
        const priceMatch = product.price <= maxPrice;
        
        // Todos los filtros deben coincidir
        return modelMatch && colorMatch && storageMatch && priceMatch;
    });
    
    // Mostrar productos filtrados o sugeridos
    if (filteredProducts.length > 0) {
        renderProducts(filteredProducts);
    } else {
        showSuggestedProducts();
    }
}

// Limpiar todos los filtros
function clearFilters() {
    // Restablecer formulario
    filterForm.reset();
    
    // Restablecer estado de filtros
    currentFilters = {
        model: '',
        color: '',
        storage: '',
        priceRange: 2000
    };
    
    // Actualizar valor visual
    updatePriceValue();
    
    // Mostrar todos los productos
    renderProducts(products);
}

// Mostrar productos sugeridos cuando no hay resultados
function showSuggestedProducts() {
    // Obtener 3 productos aleatorios
    const suggestedProducts = getRandomProducts(3);
    
    // Limpiar contenedor
    productsContainer.innerHTML = '';
    
    // Añadir mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = 'suggested-message';
    messageDiv.innerHTML = `
        <h3>No se encontraron iPhones con los filtros aplicados</h3>
        <p>Te sugerimos estos modelos:</p>
    `;
    productsContainer.appendChild(messageDiv);
    
    // Pintar productos sugeridos
    suggestedProducts.forEach(product => {
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
    });
}

// Obtener productos aleatorios
function getRandomProducts(count) {
    // Copiar array para no modificar el original
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    
    // Devolver los primeros 'count' elementos
    return shuffled.slice(0, count);
}

// Renderizar lista de productos
function renderProducts(productsArray) {
    // Limpiar contenedor
    productsContainer.innerHTML = '';
    
    // Crear y añadir cada producto
    productsArray.forEach(product => {
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
    });
}

// Crear elemento HTML para un producto
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card';
    
    productDiv.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name} ${product.color}" onerror="this.style.display='none'">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-details">
                <span class="product-color">${product.color}</span>
                <span class="product-storage">${product.storage}GB</span>
            </div>
            <p class="product-price">€${product.price}</p>
        </div>
    `;
    
    return productDiv;
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);