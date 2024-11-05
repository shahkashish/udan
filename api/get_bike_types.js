const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");

module.exports = async (req, res) => {
    try {
        let { data, error } = await supabase
            .from("stockStatus")
            .select("*");

        console.log("Data:", data);
        console.log("Error:", error);

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data);  // Directly return the data to see what's in the response
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: err.message });
    }
};

