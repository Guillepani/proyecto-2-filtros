// PRODUCTOS

// Array de productos
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
    { name: "iPhone 16 Pro Max", basePrice: 1899 },
  ];

  const colors = ["blanco", "negro"];
  const storages = [128, 256, 512];
  const productsArray = [];
  let id = 1;

  models.forEach((model) => {
    colors.forEach((color) => {
      storages.forEach((storage) => {
        let price = model.basePrice;
        if (storage === 256) price += 100;
        if (storage === 512) price += 200;

        const imageName = `iphone-${model.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace("iphone-", "")}-${color}.jpg`;

        productsArray.push({
          id: id++,
          name: model.name,
          model: model.name.replace("iPhone ", ""),
          color: color,
          storage: storage,
          price: price,
          image: `images/${imageName}`,
        });
      });
    });
  });

  return productsArray;
}

/* ESTADO DE FILTROS */
let currentFilters = {
  model: "",
  color: "",
  storage: "",
  priceRange: 2000,
};

/* REFERENCIAS DOM */
let headerRoot;
let mainRoot;
let footerRoot;

let productsContainer; // sección grid
let filterModal; // overlay modal
let filterToggleBtn; // botón header
let closeModalBtn; // X

let filterForm;
let clearFiltersBtn;
let priceRangeInput;
let priceValueSpan;

let lastFocusedElement = null;

// INIT
document.addEventListener("DOMContentLoaded", init);

function init() {
  headerRoot = document.getElementById("siteHeader");
  mainRoot = document.getElementById("siteMain");
  footerRoot = document.getElementById("siteFooter");

  // Inyectar estructura completa
  buildHeader();
  buildMain();
  buildFooter();
  buildModal(); // modal se crea con DOM

  // Render inicial
  renderProducts(products);

  // Listeners
  setupEventListeners();

  // Sincronizar valor inicial
  updatePriceValue();
}

// HELPERS DOM

function createEl(tag, options = {}) {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;
  if (options.id) node.id = options.id;
  if (options.text !== undefined) node.textContent = options.text;

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }

  return node;
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function uniqueValues(array, key) {
  const set = new Set(array.map((item) => item[key]));
  return Array.from(set);
}

// BUILD HEADER / MAIN / FOOTER (todo por DOM)

function buildHeader() {
  const header = createEl("header", { className: "header" });
  const container = createEl("div", { className: "container" });
  const headerContent = createEl("div", { className: "header-content" });

  // Logo
  const h1 = createEl("h1", { className: "logo" });

  const icon = createEl("span", { className: "logo-icon", text: "📱" });
  const brandText = createEl("span", { text: "iPhone Store" });

  h1.append(icon, brandText);

  // Botón filtrar
  filterToggleBtn = createEl("button", {
    className: "btn-filter",
    id: "filterToggle",
    attrs: {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-controls": "filterModal",
    },
  });

  const btnSpan = createEl("span", { text: "Filtrar" });

  // Icono SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 6H20M7 12H17M9 18H15");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);

  filterToggleBtn.append(btnSpan, svg);

  headerContent.append(h1, filterToggleBtn);
  container.appendChild(headerContent);
  header.appendChild(container);

  // Inyectar en el headerRoot escueto
  clearNode(headerRoot);
  headerRoot.appendChild(header);
}

function buildMain() {
  const main = createEl("main", { className: "main" });
  const container = createEl("div", { className: "container" });

  // Sección productos
  productsContainer = createEl("section", {
    className: "products-grid",
    id: "productsContainer",
    attrs: { "aria-label": "Listado de productos" },
  });

  container.appendChild(productsContainer);
  main.appendChild(container);

  clearNode(mainRoot);
  mainRoot.appendChild(main);
}

function buildFooter() {
  const footer = createEl("footer", { className: "footer" });
  const container = createEl("div", { className: "container" });

  const footerContent = createEl("div", { className: "footer-content" });

  // Sección 1
  const sec1 = createEl("div", { className: "footer-section" });
  sec1.append(
    createEl("h3", { text: "iPhone Store Valencia" }),
    createEl("p", { text: "Distribuidor autorizado de productos Apple" }),
    createEl("p", { text: "Venta de iPhones nuevos y certificados" })
  );

  // Sección 2
  const sec2 = createEl("div", { className: "footer-section" });
  sec2.append(
    createEl("h4", { text: "Contacto" }),
    createEl("p", { text: "📞 +34 901 01 01 01" }),
    createEl("p", { text: "✉️ info@iphonestorevalencia.es" }),
    createEl("p", { text: "📍 Valencia" })
  );

  // Sección 3
  const sec3 = createEl("div", { className: "footer-section" });
  sec3.append(
    createEl("h4", { text: "Servicios" }),
    createEl("p", { text: "✅ Garantía 2 años" }),
    createEl("p", { text: "✅ Envío gratis en 24h" }),
    createEl("p", { text: "✅ Financiación disponible" })
  );

  // Sección 4
  const sec4 = createEl("div", { className: "footer-section" });
  sec4.append(
    createEl("h4", { text: "Legal" }),
    createEl("p", { text: "🔒 Política de privacidad" }),
    createEl("p", { text: "📄 Términos y condiciones" }),
    createEl("p", { text: "🔄 Política de devoluciones" })
  );

  footerContent.append(sec1, sec2, sec3, sec4);

  const footerBottom = createEl("div", { className: "footer-bottom" });
  footerBottom.append(
    createEl("p", {
      text: "© 2024 iPhone Store Valencia. Todos los derechos reservados. Apple y iPhone son marcas registradas de Apple Inc. Esta web es un proyecto de bootcamp.",
    }),
    createEl("p", { text: "Web creada por Guillem Paniagua" })
  );

  container.append(footerContent, footerBottom);
  footer.appendChild(container);

  clearNode(footerRoot);
  footerRoot.appendChild(footer);
}

//MODAL
function buildModal() {
  // Overlay modal
  filterModal = createEl("div", {
    className: "modal",
    id: "filterModal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Filtros de productos",
    },
  });

  // Caja contenido
  const modalContent = createEl("div", { className: "modal-content" });

  // Header modal
  const modalHeader = createEl("div", { className: "modal-header" });
  const title = createEl("h2", { text: "Filtrar iPhones" });

  closeModalBtn = createEl("span", {
    className: "close",
    text: "×",
    attrs: { role: "button", tabindex: "0", "aria-label": "Cerrar modal" },
  });

  modalHeader.append(title, closeModalBtn);

  // Body modal (scroll interno)
  const modalBody = createEl("div", { className: "modal-body" });

  // Form
  filterForm = createEl("form", { attrs: { id: "filterForm" } });

  // Filtro por modelo
  const modelGroup = createFormGroupSelect({
    labelText: "Modelo:",
    selectId: "model",
    defaultText: "Todos los modelos",
    options: uniqueValues(products, "model").sort(sortModelsSmart),
  });

  //  Filtro por color
  const colorGroup = createFormGroupSelect({
    labelText: "Color:",
    selectId: "color",
    defaultText: "Todos los colores",
    options: uniqueValues(products, "color"),
  });

  //  Filtro por almacenamiento
  const storageGroup = createFormGroupSelect({
    labelText: "Almacenamiento:",
    selectId: "storage",
    defaultText: "Todos los almacenamientos",
    options: uniqueValues(products, "storage")
      .sort((a, b) => a - b)
      .map(String),
    formatOptionText: (v) => `${v}GB`,
  });

  //  Filtro por precio (range)
  const priceGroup = createEl("div", { className: "form-group" });

  const priceLabel = createEl("label", { attrs: { for: "priceRange" } });
  priceLabel.appendChild(document.createTextNode("Precio máximo: "));

  priceValueSpan = createEl("span", { id: "priceValue", text: "€2000" });
  priceLabel.appendChild(priceValueSpan);

  priceRangeInput = createEl("input", {
    attrs: {
      type: "range",
      id: "priceRange",
      name: "priceRange",
      min: "0",
      max: "2000",
      value: "2000",
      step: "50",
    },
  });

  priceGroup.append(priceLabel, priceRangeInput);

  // Montar el form
  filterForm.append(modelGroup, colorGroup, storageGroup, priceGroup);

  modalBody.appendChild(filterForm);

  // Footer modal
  const modalFooter = createEl("div", { className: "modal-footer" });

  const applyBtn = createEl("button", {
    className: "btn btn-primary",
    text: "Aplicar filtros",
    attrs: { type: "submit" },
  });

  clearFiltersBtn = createEl("button", {
    className: "btn btn-secondary",
    text: "Limpiar filtros",
    attrs: { type: "button", id: "clearFilters" },
  });

  applyBtn.setAttribute("form", "filterForm");

  modalFooter.append(applyBtn, clearFiltersBtn);

  modalContent.append(modalHeader, modalBody, modalFooter);
  filterModal.appendChild(modalContent);

  // Insertar modal al final del body
  document.body.appendChild(filterModal);
}

function createFormGroupSelect({
  labelText,
  selectId,
  defaultText,
  options,
  formatOptionText,
}) {
  const group = createEl("div", { className: "form-group" });

  const label = createEl("label", {
    text: labelText,
    attrs: { for: selectId },
  });

  const select = createEl("select", {
    attrs: { id: selectId, name: selectId },
  });

  // Opción "Todos"
  const optDefault = createEl("option", {
    text: defaultText,
    attrs: { value: "" },
  });
  select.appendChild(optDefault);

  // Opciones dinámicas
  options.forEach((val) => {
    const option = createEl("option", {
      text: formatOptionText ? formatOptionText(val) : String(val),
      attrs: { value: String(val) },
    });
    select.appendChild(option);
  });

  group.append(label, select);
  return group;
}

function sortModelsSmart(a, b) {
  const na = parseInt(a, 10);
  const nb = parseInt(b, 10);

  const aIsNum = !Number.isNaN(na);
  const bIsNum = !Number.isNaN(nb);

  if (aIsNum && bIsNum) {
    if (na !== nb) return na - nb;
    return a.localeCompare(b, "es");
  }
  if (aIsNum) return -1;
  if (bIsNum) return 1;
  return a.localeCompare(b, "es");
}

// EVENT LISTENERS (abrir/cerrar modal, filtros, etc.)
function setupEventListeners() {
  // Abrir modal
  filterToggleBtn.addEventListener("click", openModal);

  // Cerrar modal (X)
  closeModalBtn.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") closeModal();
  });

  // Cerrar modal click fuera (overlay)
  filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) closeModal();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filterModal.style.display === "block")
      closeModal();
  });

  // Submit filtros
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
    closeModal();
  });

  // Limpiar filtros
  clearFiltersBtn.addEventListener("click", clearFilters);

  // Range precio (actualiza el texto)
  priceRangeInput.addEventListener("input", updatePriceValue);
}

function openModal() {
  lastFocusedElement = document.activeElement;
  filterModal.style.display = "block";

  // Bloquear scroll del body (opcional pro)
  document.body.style.overflow = "hidden";

  // Llevar foco al primer select
  const firstSelect = filterForm.querySelector("select");
  if (firstSelect) firstSelect.focus();
}

function closeModal() {
  filterModal.style.display = "none";
  document.body.style.overflow = "";

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

// FILTRADO + RENDER
function updatePriceValue() {
  priceValueSpan.textContent = `€${priceRangeInput.value}`;
  currentFilters.priceRange = parseInt(priceRangeInput.value, 10);
}

function applyFilters() {
  // Leer valores del form
  const model = document.getElementById("model").value;
  const color = document.getElementById("color").value;
  const storage = document.getElementById("storage").value;
  const maxPrice = parseInt(priceRangeInput.value, 10);

  currentFilters.model = model;
  currentFilters.color = color;
  currentFilters.storage = storage;
  currentFilters.priceRange = maxPrice;

  // Filtrado conjunto
  const filteredProducts = products.filter((product) => {
    const modelMatch = !model || product.model === model;
    const colorMatch = !color || product.color === color;
    const storageMatch = !storage || product.storage === parseInt(storage, 10);
    const priceMatch = product.price <= maxPrice;

    return modelMatch && colorMatch && storageMatch && priceMatch;
  });

  if (filteredProducts.length > 0) {
    renderProducts(filteredProducts);
  } else {
    showSuggestedProducts();
  }
}

function clearFilters() {
  // Reset del formulario
  filterForm.reset();

  // Reset estado
  currentFilters = {
    model: "",
    color: "",
    storage: "",
    priceRange: 2000,
  };

  // Reset range
  priceRangeInput.value = "2000";
  updatePriceValue();

  // Mostrar todo
  renderProducts(products);
}

function renderProducts(productsArray) {
  clearNode(productsContainer);

  productsArray.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

// SUGERIDOS
function showSuggestedProducts() {
  const suggestedProducts = getRandomProducts(3);

  clearNode(productsContainer);

  // Mensaje sugerencias
  const messageDiv = createEl("div", { className: "suggested-message" });
  const h3 = createEl("h3", {
    text: "No se encontraron iPhones con los filtros aplicados",
  });
  const p = createEl("p", { text: "Te sugerimos estos modelos:" });
  messageDiv.append(h3, p);

  productsContainer.appendChild(messageDiv);

  // Pintar 3 sugeridos
  suggestedProducts.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });
}

function getRandomProducts(count) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// PRODUCT CARD
function createProductElement(product) {
  const productDiv = createEl("div", { className: "product-card" });

  // Imagen
  const imageWrap = createEl("div", { className: "product-image" });

  const img = createEl("img", {
    attrs: {
      src: product.image,
      alt: `${product.name} ${product.color}`,
    },
  });

  // Si la imagen falla, la oculto
  img.addEventListener("error", () => {
    img.style.display = "none";
    // Texto fallback
    imageWrap.textContent = "Imagen no disponible";
  });

  imageWrap.appendChild(img);

  // Info
  const info = createEl("div", { className: "product-info" });

  const title = createEl("h3", {
    className: "product-title",
    text: product.name,
  });

  const details = createEl("div", { className: "product-details" });
  const color = createEl("span", {
    className: "product-color",
    text: product.color,
  });
  const storage = createEl("span", {
    className: "product-storage",
    text: `${product.storage}GB`,
  });
  details.append(color, storage);

  const price = createEl("p", {
    className: "product-price",
    text: `€${product.price}`,
  });

  info.append(title, details, price);

  productDiv.append(imageWrap, info);

  return productDiv;
}
