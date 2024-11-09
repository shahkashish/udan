const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static('public'));
const { createClient } = require('@supabase/supabase-js');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the Change Status page
app.get('/changeStatus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'changeStatus.html'));
});

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
            .select('bike_name')
        if (error) {
            res.status(500).json({ error: error.message });
        }

        const types = [...new Set(data.map(row => row.bike_name))];
        console.log(types)
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/get_all_chasis', async (req, res) => {
    try {
        // Query the 'stockStatus' table to get distinct bike types
        const { data, error } = await supabase
            .from('stockStatus')
            .select('chasis_no')
        console.log(data)
        if (error) {
            res.status(500).json({ error: error.message });
        }

        const types = [...new Set(data.map(row => row.chasis_no))];
        console.log(types)
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/get_bike_details', async (req, res) => {
    try {
        const chasis_no = req.query.chasis_no;
        const { data, error } = await supabase
            .from('stockStatus')
            .select('*')
            .eq('chasis_no', chasis_no)
        if (error) {
            res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/upload_excel_data', async (req, res) => {
    const excelData = req.body;
    try {
        const insertPromises = excelData.map(async (row) => {
            const { data, error } = await supabase
                .from('stockStatus')
                .insert([
                    {
                        chasis_no: row.CHASSIS_NO,
                        bike_name: row.MODEL,
                        status: row.ALLOTMENT_STATUS,
                        bike_color: row.COLOUR,
                        cost: row.cost,
                        location: row.VEHICLE_STANDING,
                        sub_dealer_name: row.SALE_EXE,
                        sub_dealer_contact_no: row.COTACT_NO
                    }
                ])
                .select();

            if (error) {
                console.error("Error inserting row:", error);
                throw new Error(`Failed to insert row: ${error.message}`);
            }
            return data;
        });

        await Promise.all(insertPromises);  // Waits for all insertions to complete
        res.json({ message: 'Data uploaded successfully' });

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: 'Failed to upload data' });
    }
});
app.post('/update_bike_details', async (req, res) => {
    const bikeData = req.body;
    try {

        const { error } = await supabase
        .from('stockStatus')
        .delete()
        .eq('chasis_no', bikeData.chasis_no)

    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: 'Failed to update data' });
    }


    try {
        const { data, error } = await supabase
            .from('stockStatus')
            .insert([
                {
                    chasis_no: bikeData.chasis_no,
                    bike_name: bikeData.model,
                    status: bikeData.status,
                    bike_color: bikeData.color,
                    cost: bikeData.cost,
                    sold_for: bikeData.sold_for,
                    location: bikeData.location,
                    sub_dealer_name: bikeData.sub_dealer_name,
                    sub_dealer_contact_no: bikeData.sub_dealer_contact_no
                }
            ])
            .select();

        
        res.json({ message: 'Data uploaded successfully' });

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: 'Failed to upload data' });
    }
});

app.get('/get_colours', async (req, res) => {
    try {
        const bike_name = req.query.bike_name;
        console.log(bike_name)
        const status = req.query.status;
        if(status === "Sold"){
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('bike_color')
                .eq('bike_name', bike_name)
                .eq('status',"SOLD"));
        } else if(status === "") {
            ({ data, error } = await supabase
                .from('stockStatus')    
                .select('bike_color')
                .eq('bike_name', bike_name));
        } else {
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('bike_color')
                .eq('bike_name', bike_name)
                .neq('status',"SOLD"));
        }

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            console.log("here")
            res.json([...new Set(data.map(row => row.bike_color))]);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err });
    }
});

app.get('/get_bikes', async (req, res) => {
    try {
        const { bike_name, bike_color ,status} = req.query;
    
    
        if (bike_name === "" && bike_color === "" && status === "") {
            // Case 1: All parameters are empty
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
            );
        } else if (bike_name !== "" && bike_color === "" && status === "") {
            // Case 2: Only bike_name is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_name', bike_name)
            );
        } else if (bike_name === "" && bike_color !== "" && status === "") {
            // Case 3: Only bike_color is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_color', bike_color)
            );
        } else if (bike_name === "" && bike_color === "" && status !== "") {
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
            
        } else if (bike_name !== "" && bike_color !== "" && status === "") {
            // Case 5: bike_name and bike_color are provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_name', bike_name)
                .eq('bike_color', bike_color)
            );
        } else if (bike_name !== "" && bike_color === "" && status !== "") {
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .neq('status', "SOLD")
                );
            }
            // Case 6: bike_name and status are provided
            
        } else if (bike_name === "" && bike_color !== "" && status !== "") {
            // Case 7: bike_color and status are provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_color', bike_color)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_color', bike_color)
                    .neq('status', "SOLD")
                );
            }
            
        } else if (bike_name !== "" && bike_color !== "" && status !== "") {
            // Case 8: All parameters are provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .eq('bike_color', bike_color)
                    .eq('status', "SOLD")
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .eq('bike_color', bike_color)
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
