const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");
console.log("here")
module.exports = async (req, res) => {
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
};
