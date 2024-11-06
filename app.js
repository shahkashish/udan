const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
const { createClient } = require('@supabase/supabase-js');


// Initialize Supabase client
const supabaseUrl = "https://asbphrnlbbgpphwryywe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define an endpoint to get bike types
app.get('/get_bike_types', async (req, res) => {
    try {
        // Query the 'stockStatus' table to get distinct bike types
        const { data, error } = await supabase
            .from('stockStatus')
            .select('bikeName')
        console.log("Data:", data);  // Add this line to debug
        console.log("Error:", error);
        // Handle any errors from Supabase
        if (error) {
            console.log("here")
            return res.status(500).json({ error: error.message });
        }

        // Extract and send only distinct types
        const types = [...new Set(data.map(row => row.bikeName))];
    
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});



// Serve static files (for HTML, CSS, and JS in the frontend)


// Route to get bike types


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
