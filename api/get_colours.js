const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    const bikeType = req.query.bikeType;
    const { data, error } = await supabase
        .from('bikes')
        .select('colour')
        .eq('type', bikeType)
        .distinct();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data.map(row => row.colour));
    }
};
