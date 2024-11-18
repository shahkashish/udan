const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
module.exports = async (req, res) => {
    const BATCH_SIZE = 1000; // Number of rows to fetch per batch
    let allData = [];
    let offset = 0;
    let hasMoreData = true;

    try {
        const { bike_name, bike_color, status } = req.query;

        while (hasMoreData) {
            let query = supabase.from('stockStatus').select('*').range(offset, offset + BATCH_SIZE - 1);

            // Apply conditions based on input parameters
            if (bike_name) query = query.eq('bike_name', bike_name);
            if (bike_color) query = query.eq('bike_color', bike_color);
            if (status) {
                if (status === "Sold") {
                    query = query.eq('status', "SOLD");
                } else {
                    query = query.neq('status', "SOLD");
                }
            }

            // Fetch data
            const { data, error } = await query;

            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }

            if (data.length === 0) {
                hasMoreData = false; // Stop fetching if no more data
            } else {
                allData = allData.concat(data);
                offset += BATCH_SIZE; // Update offset for the next batch
            }
        }

        res.json(allData);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
