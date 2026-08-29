import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yhjjojxharvdxbfznxey.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloampvanhoYXJ2ZHhiZnpueGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTg5NjcsImV4cCI6MjEwMjgzNDk2N30.Z_3zc4mWj5Kw-fWs3JiGGoseMxWbNaE8cHaYCsElwSA';

export const supabase = createClient(supabaseUrl, supabaseKey);
