const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
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
