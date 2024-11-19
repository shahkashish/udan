// const { createClient } = require('@supabase/supabase-js');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// module.exports = async (req, res) => {
//     try {
//         const excelData = req.body;
//         let query = supabase.from('stockStatus');
//         const insertData = excelData.map(row =>{
//             query=query.insert([
//                 {
//                     chasis_no: row.CHASSIS_NO,
//                     bike_name: row.MODEL,
//                     status: row.ALLOTMENT_STATUS,
//                     bike_color: row.COLOUR,
//                     cost: row.cost,
//                     location: row.VEHICLE_STANDING,
//                     sub_dealer_name: row.SALE_EXE,
//                     sub_dealer_contact_no: row.COTACT_NO
//                 }
//             ])
//         });
//         const { error } = await query;
//         if (error) {
//             res.status(500).json({ error: error.message });
//             return;
//         }


//     // try {
//     //     const insertPromises = excelData.map(async (row) => {
//     //         try {

//     //             const { error } = await supabase
//     //             .from('stockStatus')
//     //             .delete()
//     //             .eq('chasis_no', row.CHASSIS_NO)
        
//     //         } catch (error) {
//     //             console.error("Error insert data:", error);
//     //             res.status(500).json({ error: 'Failed to insert data' });
//     //         }

//     //         const{ data, error1 } = await supabase
//     //             .from('stockStatus')
//     //             .insert([
//     //                 {
//     //                     chasis_no: row.CHASSIS_NO.toUpperCase,
//     //                     bike_name: row.MODEL.toUpperCase,
//     //                     status: row.ALLOTMENT_STATUS.toUpperCase,
//     //                     bike_color: row.COLOUR.toUpperCase,
//     //                     cost: row.cost,
//     //                     location: row.VEHICLE_STANDING.toUpperCase,
//     //                     sub_dealer_name: row.SALE_EXE.toUpperCase,
//     //                     sub_dealer_contact_no: row.COTACT_NO
//     //                 }
//     //             ])
//     //             .select();

//     //         if (error) {
//     //             console.error("Error inserting row:", error);
//     //             throw new Error(`Failed to insert row: ${error.message}`);
//     //         }
//     //         return data;
//     //     });

//     //     await Promise.all(insertPromises);  // Waits for all insertions to complete
//     //     res.json({ message: 'Data uploaded successfully' });

//     } 
//     catch (error) {
//         console.error("Error inserting data:", error);
//         res.status(500).json({ error: 'Failed to upload data' });
//     }
// };


const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const BATCH_SIZE = 500;

async function deleteInBatches(chasisList) {
    for (let i = 0; i < chasisList.length; i += BATCH_SIZE) {
        const batch = chasisList.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('stockStatus')
            .delete()
            .in('chasis_no', batch);

        if (error) {
            throw new Error(`Batch deletion failed: ${error.message}`);
        }
    }
}
module.exports = async (req, res) => {
    try {
        const excelData = req.body;

        if (!Array.isArray(excelData) || excelData.length === 0) {
            res.status(400).json({ error: "No data provided or invalid format." });
            return;
        }

        // Extract chassis numbers for deletion
        const chasis_to_delete = excelData.map(row => row.CHASSIS_NO).filter(Boolean); // Filter out falsy values
        await deleteInBatches(chasis_to_delete)

        // Prepare data for bulk insertion
        const insertData = excelData.map(row => ({
            chasis_no: row.CHASSIS_NO,
            bike_name: row.MODEL,
            status: row.ALLOTMENT_STATUS,
            bike_color: row.COLOUR,
            cost: row.COST, // Ensure the column name matches your Supabase table
            sold_for: row.SOLD_FOR,
            location: row.VEHICLE_STANDING,
            sub_dealer_name: row.SALE_EXE,
            sub_dealer_contact_no: row.CONTACT_NO,
        }));

        // Perform bulk insertion
        const { error: insertError } = await supabase
            .from('stockStatus')
            .insert(insertData);

        if (insertError) {
            console.error("Error during insertion:", insertError);
            res.status(500).json({ error: `Insertion failed: ${insertError.message}` });
            return;
        }

        // Success response
        res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
        // Handle server error
        console.error("Error processing request:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
