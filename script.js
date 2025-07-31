const username = localStorage.getItem("username");
if (!username) window.location.href = "index.html";

async function loadCategory(category) {
  const res = await fetch(`http://localhost:3000/api/products/${category}`);
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
}

async function addToCart(productId) {
  await fetch('http://localhost:3000/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, productId })
  });
  alert("Added to cart!");
}

async function viewCart() {
  const res = await fetch(`http://localhost:3000/api/cart/${username}`);
  const items = await res.json();
  alert("Cart:\n" + items.map(p => `${p.name} - ₹${p.price}`).join("\n"));
}

async function placeOrder() {
  const res = await fetch(`http://localhost:3000/api/order/${username}`);
  const data = await res.json();
  const summary = data.items.map(p => `${p.name} - ₹${p.price}`).join("\n");
  alert(`Order Summary:\n${summary}\n\nTotal: ₹${data.total}`);

  document.getElementById("payment").style.display = "block";
}

let allProducts = [];

async function loadCategory(category) {
  const res = await fetch(`http://localhost:3000/api/products/${category}`);
  allProducts = await res.json();
  displayProducts(allProducts);
}

function displayProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
}

function searchProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search));
  displayProducts(filtered);
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}
