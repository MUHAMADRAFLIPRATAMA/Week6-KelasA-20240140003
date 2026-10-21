// ===== Bagian 1: Fetch API – Data Produk =====
const API_URL = "https://dummyjson.com/products";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("product-list");

// Format harga ke dolar (data DummyJSON memakai USD)
const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function showLoading() {
  listEl.innerHTML = "";
  statusEl.innerHTML = '<div class="status-box"><span class="spinner"></span><span>Memuat data produk...</span></div>';
}

function showError(message) {
  statusEl.innerHTML = "";
  const box = document.createElement("div");
  box.className = "status-box error";

  const text = document.createElement("span");
  text.textContent = `Gagal memuat produk: ${message}`;

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "btn-ghost";
  retry.textContent = "Coba lagi";
  retry.addEventListener("click", loadProducts);

  box.append(text, retry);
  statusEl.appendChild(box);
}

function renderProducts(products) {
  statusEl.innerHTML = "";
  if (products.length === 0) {
    statusEl.innerHTML = '<div class="status-box">Belum ada produk untuk ditampilkan.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const li = document.createElement("li");
    li.className = "product-card";

    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "product-body";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.title;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    body.append(name, category, price);
    li.append(img, body);
    fragment.appendChild(li);
  });
  listEl.appendChild(fragment);
}

async function loadProducts() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Server membalas dengan status ${response.status}`);
    }
    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {
    showError(error.message);
  }
}

loadProducts();