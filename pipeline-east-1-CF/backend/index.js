const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ========== API Routes ==========

// Add new item
app.post('/add-item', (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Missing name or quantity' });
  }
  const query = 'INSERT INTO items (name, quantity) VALUES (?, ?)';
  db.query(query, [name, quantity], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'DB Insert Failed' });
    }
    res.status(200).json({ message: 'Item added successfully' });
  });
});

// Get all items
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'DB Fetch Failed' });
    }
    res.json(results);
  });
});

// Health check route
app.get('/health', (req, res) => res.send('OK'));

// ========== Serve React Frontend ==========
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ========== Start Server ==========
app.listen(PORT, () => {
  console.log(`✅ Inventory Service is running on port ${PORT}`);
});
