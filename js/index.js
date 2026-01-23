// PRODUCTOS

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

let productsContainer;
let filterModal;
let filterToggleBtn;
let closeModalBtn;

let filterForm;
let clearFiltersBtn;
let priceRangeInput;
let priceValueSpan;

let lastFocusedElement = null;

/* INIT */
document.addEventListener("DOMContentLoaded", init);

function init() {
  headerRoot = document.getElementById("siteHeader");
  mainRoot = document.getElementById("siteMain");
  footerRoot = document.getElementById("siteFooter");

  buildHeader();
  buildMain();
  buildFooter();
  buildModal();

  renderProducts(products);
  setupEventListeners();
  updatePriceValue();
}

/* HELPERS DOM */
function createEl(tag, options = {}) {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;
  if (options.id) node.id = options.id;
  if (options.text !== undefined) node.textContent = options.text;

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) =>
      node.setAttribute(k, v)
    );
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

/* BUILD HEADER */
function buildHeader() {
  clearNode(headerRoot);
  headerRoot.className = "header";

  const container = createEl("div", { className: "container" });
  const headerContent = createEl("div", { className: "header-content" });

  const h1 = createEl("h1", { className: "logo" });
  const icon = createEl("span", { className: "logo-icon", text: "📱" });
  const brandText = createEl("span", { text: "iPhone Store" });
  h1.append(icon, brandText);

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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M4 6H20M7 12H17M9 18H15");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  svg.appendChild(path);

  filterToggleBtn.append(btnSpan, svg);

  headerContent.append(h1, filterToggleBtn);
  container.appendChild(headerContent);
  headerRoot.appendChild(container);
}

/* BUILD MAIN */
function buildMain() {
  clearNode(mainRoot);
  mainRoot.className = "main";

  const container = createEl("div", { className: "container" });

  productsContainer = createEl("section", {
    className: "products-grid",
    id: "productsContainer",
    attrs: { "aria-label": "Listado de productos" },
  });

  container.appendChild(productsContainer);
  mainRoot.appendChild(container);
}

/* BUILD FOOTER */
function buildFooter() {
  clearNode(footerRoot);
  footerRoot.className = "footer";

  const container = createEl("div", { className: "container" });
  const footerContent = createEl("div", { className: "footer-content" });

  const sec1 = createEl("section", { className: "footer-section" });
  sec1.append(
    createEl("h3", { text: "iPhone Store Valencia" }),
    createEl("p", { text: "Distribuidor autorizado de productos Apple" }),
    createEl("p", { text: "Venta de iPhones nuevos y certificados" })
  );

  const sec2 = createEl("address", { className: "footer-section" });
  sec2.append(
    createEl("h4", { text: "Contacto" }),
    createEl("p", { text: "+34 901 01 01 01" }),
    createEl("p", { text: "info@iphonestorevalencia.es" }),
    createEl("p", { text: "Valencia" })
  );

  const sec3 = createEl("section", { className: "footer-section" });
  const servicesTitle = createEl("h4", { text: "Servicios" });
  const servicesList = createEl("ul");
  servicesList.append(
    createEl("li", { text: "Garantía 2 años" }),
    createEl("li", { text: "Envío gratis en 24h" }),
    createEl("li", { text: "Financiación disponible" })
  );
  sec3.append(servicesTitle, servicesList);

  const sec4 = createEl("section", { className: "footer-section" });
  const legalTitle = createEl("h4", { text: "Legal" });
  const legalList = createEl("ul");
  legalList.append(
    createEl("li", { text: "Política de privacidad" }),
    createEl("li", { text: "Términos y condiciones" }),
    createEl("li", { text: "Política de devoluciones" })
  );
  sec4.append(legalTitle, legalList);

  footerContent.append(sec1, sec2, sec3, sec4);

  const footerBottom = createEl("div", { className: "footer-bottom" });
  footerBottom.append(
    createEl("p", {
      text: "© 2024 iPhone Store Valencia. Todos los derechos reservados. Apple y iPhone son marcas registradas de Apple Inc. Proyecto académico de bootcamp.",
    }),
    createEl("p", { text: "Web creada por Guillem Paniagua" })
  );

  container.append(footerContent, footerBottom);
  footerRoot.appendChild(container);
}

/* MODAL */
function buildModal() {
  filterModal = createEl("div", {
    className: "modal",
    id: "filterModal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Filtros de productos",
    },
  });

  const modalContent = createEl("div", { className: "modal-content" });

  const modalHeader = createEl("div", { className: "modal-header" });
  const title = createEl("h2", { text: "Filtrar iPhones" });

  closeModalBtn = createEl("span", {
    className: "close",
    text: "×",
    attrs: { role: "button", tabindex: "0", "aria-label": "Cerrar modal" },
  });

  modalHeader.append(title, closeModalBtn);

  const modalBody = createEl("div", { className: "modal-body" });
  filterForm = createEl("form", { attrs: { id: "filterForm" } });

  const modelGroup = createFormGroupSelect({
    labelText: "Modelo:",
    selectId: "model",
    defaultText: "Todos los modelos",
    options: uniqueValues(products, "model").sort(sortModelsSmart),
  });

  const colorGroup = createFormGroupSelect({
    labelText: "Color:",
    selectId: "color",
    defaultText: "Todos los colores",
    options: uniqueValues(products, "color"),
  });

  const storageGroup = createFormGroupSelect({
    labelText: "Almacenamiento:",
    selectId: "storage",
    defaultText: "Todos los almacenamientos",
    options: uniqueValues(products, "storage")
      .sort((a, b) => a - b)
      .map(String),
    formatOptionText: (v) => `${v}GB`,
  });

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

  filterForm.append(modelGroup, colorGroup, storageGroup, priceGroup);
  modalBody.appendChild(filterForm);

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

  const optDefault = createEl("option", {
    text: defaultText,
    attrs: { value: "" },
  });
  select.appendChild(optDefault);

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

/* EVENT LISTENERS */
function setupEventListeners() {
  filterToggleBtn.addEventListener("click", openModal);

  closeModalBtn.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") closeModal();
  });

  filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filterModal.style.display === "block")
      closeModal();
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
    closeModal();
  });

  clearFiltersBtn.addEventListener("click", clearFilters);
  priceRangeInput.addEventListener("input", updatePriceValue);
}

function openModal() {
  lastFocusedElement = document.activeElement;
  filterModal.style.display = "block";
  document.body.style.overflow = "hidden";

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

/* FILTRADO */
function updatePriceValue() {
  priceValueSpan.textContent = `€${priceRangeInput.value}`;
  currentFilters.priceRange = parseInt(priceRangeInput.value, 10);
}

function applyFilters() {
  const model = document.getElementById("model").value;
  const color = document.getElementById("color").value;
  const storage = document.getElementById("storage").value;
  const maxPrice = parseInt(priceRangeInput.value, 10);

  currentFilters.model = model;
  currentFilters.color = color;
  currentFilters.storage = storage;
  currentFilters.priceRange = maxPrice;

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
  filterForm.reset();

  currentFilters = {
    model: "",
    color: "",
    storage: "",
    priceRange: 2000,
  };

  priceRangeInput.value = "2000";
  updatePriceValue();
  renderProducts(products);
}

function renderProducts(productsArray) {
  clearNode(productsContainer);

  productsArray.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

/* SUGERIDOS */
function showSuggestedProducts() {
  const suggestedProducts = getRandomProducts(3);

  clearNode(productsContainer);

  const messageSection = createEl("section", {
    className: "suggested-message",
  });
  const h3 = createEl("h3", {
    text: "No se encontraron iPhones con los filtros aplicados",
  });
  const p = createEl("p", { text: "Te sugerimos estos modelos:" });
  messageSection.append(h3, p);

  productsContainer.appendChild(messageSection);

  suggestedProducts.forEach((product) => {
    productsContainer.appendChild(createProductElement(product));
  });
}

function getRandomProducts(count) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* PRODUCT CARD */
function createProductElement(product) {
  const productArticle = createEl("article", {
    className: "product-card",
  });

  const imageWrap = createEl("div", { className: "product-image" });

  const img = createEl("img", {
    attrs: {
      src: product.image,
      alt: `${product.name} ${product.color}`,
    },
  });

  img.addEventListener("error", () => {
    img.style.display = "none";
    imageWrap.textContent = "Imagen no disponible";
  });

  imageWrap.appendChild(img);

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
  productArticle.append(imageWrap, info);

  return productArticle;
}
