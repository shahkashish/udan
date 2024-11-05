const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    const { bikeType, colour } = req.query;
    const { data, error } = await supabase
        .from('bikes')
        .select('id, type, colour, price, status')
        .eq('type', bikeType)
        .eq('colour', colour)
        .neq('status', 'sold');

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data);
    }
};
