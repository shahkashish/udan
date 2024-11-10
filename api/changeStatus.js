const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve static files from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route to serve the Change Status page
app.get('/changeStatus', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'changeStatus.html'));
});

app.get('/uploadExcel', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'uploadExcel.html'));
});

// Export the app as a serverless function
module.exports = app;