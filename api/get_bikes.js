const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");

module.exports = async (req, res) => {
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
        console.log("api")
        if(data === null)res.json(null)
        else res.json(data);
    }
        











    
};
