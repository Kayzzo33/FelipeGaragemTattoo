import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yhjjojxharvdxbfznxey.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloampvanhoYXJ2ZHhiZnpueGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTg4MDAsImV4cCI6MjAyNTEzNDgwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
