const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
        
    const bikeData = req.body;
    try {

        const { error } = await supabase
        .from('stockStatus')
        .delete()
        .eq('chasis_no', bikeData.chasis_no)

    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: 'Failed to update data' });
    }


    try {
        const { data, error } = await supabase
            .from('stockStatus')
            .insert([
                {
                    chasis_no: bikeData.chasis_no,
                    bike_name: bikeData.model,
                    status: bikeData.status,
                    bike_color: bikeData.color,
                    cost: bikeData.cost,
                    sold_for: bikeData.sold_for,
                    location: bikeData.location,
                    sub_dealer_name: bikeData.sub_dealer_name,
                    sub_dealer_contact_no: bikeData.sub_dealer_contact_no
                }
            ])
            .select();

        
        res.json({ message: 'Data uploaded successfully' });

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: 'Failed to upload data' });
    }
};