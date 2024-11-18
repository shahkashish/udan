const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    const BATCH_SIZE = 1000; // Number of rows to fetch in each batch
    let allChasisNumbers = [];
    let offset = 0;
    let hasMoreData = true;

    try {
        while (hasMoreData) {
            // Fetch a batch of data
            const { data, error } = await supabase
                .from('stockStatus')
                .select('chasis_no')
                .range(offset, offset + BATCH_SIZE - 1); // Fetch data within the range

            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }

            // If no data is returned, stop the loop
            if (data.length === 0) {
                hasMoreData = false;
            } else {
                allChasisNumbers = allChasisNumbers.concat(data.map(row => row.chasis_no));
                offset += BATCH_SIZE; // Move the offset for the next batch
            }
        }

        // Remove duplicates
        const uniqueChasisNumbers = [...new Set(allChasisNumbers)];

        res.json(uniqueChasisNumbers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

