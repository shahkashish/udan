const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./bikes.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Serve static files (for HTML, CSS, and JS in the frontend)
app.use(express.static('public'));

// Route to get bike types
app.get('/get_bike_types', (req, res) => {
    db.all("SELECT DISTINCT type FROM bikes", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.type));
    });
});

// Route to get available colours for a selected bike type
app.get('/get_colours', (req, res) => {
    const bikeType = req.query.bikeType;
    db.all("SELECT DISTINCT colour FROM bikes WHERE type = ?", [bikeType], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.colour));
    });
});

// Route to get available bikes based on selected type and colour
app.get('/get_bikes', (req, res) => {
    const { bikeType, colour } = req.query;
    const query = "SELECT id, type, colour, price, status FROM bikes WHERE type = ? AND colour = ? AND status != 'sold'";
    db.all(query, [bikeType, colour], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => ({
            id: row.id,
            type: row.type,
            colour: row.colour,
            price: row.price,
            status: row.status
        })));
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
