const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Read JSON files
let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
let carts = JSON.parse(fs.readFileSync(path.join(__dirname, 'carts.json'), 'utf8'));
let products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ msg: 'User exists' });
  }

  users.push({ username, password });

  fs.writeFileSync(
    path.join(__dirname, 'users.json'),
    JSON.stringify(users, null, 2)
  );

  res.json({ msg: 'Registered successfully' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const found = users.find(
    u => u.username === username && u.password === password
  );

  if (found) {
    res.json({ success: true });
  } else {
    res.status(401).json({ msg: 'Invalid credentials' });
  }
});

// Get Products
app.get('/api/products/:category', (req, res) => {
  const category = req.params.category;
  res.json(products.filter(p => p.category === category));
});

// Add to Cart
app.post('/api/cart', (req, res) => {
  const { username, productId } = req.body;

  if (!carts[username]) {
    carts[username] = [];
  }

  carts[username].push(productId);

  fs.writeFileSync(
    path.join(__dirname, 'carts.json'),
    JSON.stringify(carts, null, 2)
  );

  res.json({ msg: 'Added to cart' });
});

// View Cart
app.get('/api/cart/:username', (req, res) => {
  const userCart = carts[req.params.username] || [];

  const items = userCart.map(id =>
    products.find(p => p.id === id)
  );

  res.json(items);
});

// Order
app.get('/api/order/:username', (req, res) => {
  const userCart = carts[req.params.username] || [];

  const items = userCart.map(id =>
    products.find(p => p.id === id)
  );

  const total = items.reduce((sum, item) => sum + item.price, 0);

  res.json({
    items,
    total
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
