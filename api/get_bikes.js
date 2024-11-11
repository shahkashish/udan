const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    try {
        const { bike_name, bike_color ,status} = req.query;
    
    
        if (bike_name === "" && bike_color === "" && status === "") {
            // Case 1: All parameters are empty
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .limit(1000000)
            );
        } else if (bike_name !== "" && bike_color === "" && status === "") {
            // Case 2: Only bike_name is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_name', bike_name)
                .limit(1000000)
            );
        } else if (bike_name === "" && bike_color !== "" && status === "") {
            // Case 3: Only bike_color is provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_color', bike_color)
                .limit(1000000)
            );
        } else if (bike_name === "" && bike_color === "" && status !== "") {
            // Case 4: Only status is provided
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('status', "SOLD")
                    .limit(1000000)
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .neq('status', "SOLD")
                    .limit(1000000)
                );
            }
            
        } else if (bike_name !== "" && bike_color !== "" && status === "") {
            // Case 5: bike_name and bike_color are provided
            ({ data, error } = await supabase
                .from('stockStatus')
                .select('*')
                .eq('bike_name', bike_name)
                .eq('bike_color', bike_color)
                .limit(1000000)
            );
        } else if (bike_name !== "" && bike_color === "" && status !== "") {
            if(status === "Sold"){
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .eq('status', "SOLD")
                    .limit(1000000)
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .neq('status', "SOLD")
                    .limit(1000000)
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
                    .limit(1000000)
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_color', bike_color)
                    .neq('status', "SOLD")
                    .limit(1000000)
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
                    .limit(1000000)
                );
            } else{
                ({ data, error } = await supabase
                    .from('stockStatus')
                    .select('*')
                    .eq('bike_name', bike_name)
                    .eq('bike_color', bike_color)
                    .neq('status', "SOLD")
                    .limit(1000000)
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
