const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    const { data, error } = await supabase
        .from('bikes')
        .select('type')
        .distinct();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data.map(row => row.type));
    }
};
