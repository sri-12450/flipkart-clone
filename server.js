const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = JSON.parse(fs.readFileSync('backend/users.json', 'utf-8') || '[]');
let carts = JSON.parse(fs.readFileSync('backend/carts.json', 'utf-8') || '{}');
let products = JSON.parse(fs.readFileSync('backend/products.json', 'utf-8'));

// Register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(400).json({ msg: 'User exists' });
  users.push({ username, password });
  fs.writeFileSync('backend/users.json', JSON.stringify(users));
  res.json({ msg: 'Registered successfully' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) res.json({ success: true });
  else res.status(401).json({ msg: 'Invalid credentials' });
});

// Get products
app.get('/api/products/:category', (req, res) => {
  const category = req.params.category;
  res.json(products.filter(p => p.category === category));
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { username, productId } = req.body;
  if (!carts[username]) carts[username] = [];
  carts[username].push(productId);
  fs.writeFileSync('backend/carts.json', JSON.stringify(carts));
  res.json({ msg: 'Added to cart' });
});

// View cart
app.get('/api/cart/:username', (req, res) => {
  const userCart = carts[req.params.username] || [];
  const items = userCart.map(id => products.find(p => p.id === id));
  res.json(items);
});

// Order total
app.get('/api/order/:username', (req, res) => {
  const userCart = carts[req.params.username] || [];
  const items = userCart.map(id => products.find(p => p.id === id));
  const total = items.reduce((sum, item) => sum + item.price, 0);
  res.json({ items, total });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
