const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");

module.exports = async (req, res) => {
    const { data, error } = await supabase
        .from('stockStatus')
        .select('bikeName')

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data.map(row => row.type));
    }
};
