const { createClient } = require('@supabase/supabase-js');

const supabase = createClient("https://asbphrnlbbgpphwryywe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnBocm5sYmJncHBod3J5eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjEyNDgsImV4cCI6MjA0NjM5NzI0OH0.wf9BNvUQ7_yHyKbLUK04AeyX4UN46eXOlxK4ieYylqE");





async function getTables() {
    try {
        const { data, error } = await supabase
            .rpc('get_tables'); // Call the RPC function to get tables

        if (error) {
            console.error('Error fetching tables:', error);
            return [];
        }

        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        return [];
    }
}

// Execute the function and log the results
getTables().then(tables => {
    console.log('List of Tables:', tables);
});

