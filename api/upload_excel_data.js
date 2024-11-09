const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
        
    const excelData = req.body;
    try {
        const insertPromises = excelData.map(async (row) => {
            const { data, error } = await supabase
                .from('stockStatus')
                .insert([
                    {
                        chasis_no: row.CHASSIS_NO,
                        bike_name: row.MODEL,
                        status: row.ALLOTMENT_STATUS,
                        bike_color: row.COLOUR,
                        cost: row.cost,
                        location: row.VEHICLE_STANDING,
                        sub_dealer_name: row.SALE_EXE,
                        sub_dealer_contact_no: row.COTACT_NO
                    }
                ])
                .select();

            if (error) {
                console.error("Error inserting row:", error);
                throw new Error(`Failed to insert row: ${error.message}`);
            }
            return data;
        });

        await Promise.all(insertPromises);  // Waits for all insertions to complete
        res.json({ message: 'Data uploaded successfully' });

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: 'Failed to upload data' });
    }
};


