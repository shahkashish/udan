const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    
    try {
        const chasis_no = req.query.chasis_no;
        const { data, error } = await supabase
            .from('stockStatus')
            .select('*')
            .eq('chasis_no', chasis_no)
            .limit(1000000)
        if (error) {
            res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};