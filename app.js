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
        if (error) {
            res.status(500).json({ error: error.message });
        }

        const types = [...new Set(data.map(row => row.bikeName))];
    
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/get_colours', async (req, res) => {
    try {
        const bikeName = req.query.bikeName;
        const status = req.query.status;
        if(status === "Sold"){
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('bikeColor')
                .eq('bikeName', bikeName)
                .eq('status',"SOLD"));
        }else {
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('bikeColor')
                .eq('bikeName', bikeName)
                .neq('status',"SOLD"));
        }

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            console.log("here")
            res.json(data.map(row => row.bikeColor));
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err });
    }
});

app.get('/get_bikes', async (req, res) => {
    try {
        const { bikeName, bikeColor ,status} = req.query;
    
    
        if (bikeName === "" && bikeColor === "" && status === "") {
            // Case 1: All parameters are empty
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
            );
        } else if (bikeName !== "" && bikeColor === "" && status === "") {
            // Case 2: Only bikeName is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bikeName', bikeName)
            );
        } else if (bikeName === "" && bikeColor !== "" && status === "") {
            // Case 3: Only bikeColor is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bikeColor', bikeColor)
            );
        } else if (bikeName === "" && bikeColor === "" && status !== "") {
            // Case 4: Only status is provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .neq('status', "SOLD")
                );
            }
            
        } else if (bikeName !== "" && bikeColor !== "" && status === "") {
            // Case 5: bikeName and bikeColor are provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bikeName', bikeName)
                .eq('bikeColor', bikeColor)
            );
        } else if (bikeName !== "" && bikeColor === "" && status !== "") {
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeName', bikeName)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeName', bikeName)
                    .neq('status', "SOLD")
                );
            }
            // Case 6: bikeName and status are provided
            
        } else if (bikeName === "" && bikeColor !== "" && status !== "") {
            // Case 7: bikeColor and status are provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeColor', bikeColor)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeColor', bikeColor)
                    .neq('status', "SOLD")
                );
            }
            
        } else if (bikeName !== "" && bikeColor !== "" && status !== "") {
            // Case 8: All parameters are provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeName', bikeName)
                    .eq('bikeColor', bikeColor)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bikeName', bikeName)
                    .eq('bikeColor', bikeColor)
                    .neq('status', "SOLD")
                );
            }
            
        }
    
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
                res.json(data);
            
            
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
