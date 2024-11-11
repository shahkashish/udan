const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {

    try {
        // Query the 'stockStatus' table to get distinct bike types
        const { data, error } = await supabase
            .from('stockStatus')
            .select('bike_name')
            .limit(1000000)
        if (error) {
            res.status(500).json({ error: error.message });
        }

        const types = [...new Set(data.map(row => row.bike_name))];
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
