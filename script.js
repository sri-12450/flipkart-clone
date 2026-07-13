const BASE_URL = "https://flipkart-clone-3oq1.onrender.com";

const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "index.html";
}

let allProducts = [];

// Load Products
async function loadCategory(category) {
    try {
        const res = await fetch(`${BASE_URL}/api/products/${category}`);

        if (!res.ok) {
            throw new Error("Failed to load products");
        }

        allProducts = await res.json();
        displayProducts(allProducts);

    } catch (err) {
        console.error(err);
        alert("Unable to load products.");
    }
}

// Display Products
function displayProducts(products) {

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {

        container.innerHTML += `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>

            <button onclick="addToCart('${p.id}')">
                Add to Cart
            </button>
        </div>
        `;

    });

}

// Add To Cart
async function addToCart(productId) {

    try {

        await fetch(`${BASE_URL}/api/cart`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                productId
            })

        });

        alert("Added to Cart!");

    } catch (err) {

        console.error(err);

    }

}

// View Cart
async function viewCart() {

    const res = await fetch(`${BASE_URL}/api/cart/${username}`);

    const items = await res.json();

    alert(
        "Cart\n\n" +
        items.map(p => `${p.name} - ₹${p.price}`).join("\n")
    );

}

// Place Order
async function placeOrder() {

    const res = await fetch(`${BASE_URL}/api/order/${username}`);

    const data = await res.json();

    const summary = data.items
        .map(p => `${p.name} - ₹${p.price}`)
        .join("\n");

    alert(`Order Summary

${summary}

Total : ₹${data.total}`);

    document.getElementById("payment").style.display = "block";

}

// Search
function searchProducts() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(search)
    );

    displayProducts(filtered);

}

// Logout
function logout() {

    localStorage.removeItem("username");

    window.location.href = "index.html";

}
