const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");

module.exports = async (req, res) => {
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
        











    
};
