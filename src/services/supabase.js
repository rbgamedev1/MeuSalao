import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zhkxpbjfryswzlxpqeht.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoa3hwYmpmcnlzd3pseHBxZWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDA3MzUsImV4cCI6MjA3OTQxNjczNX0.gi13Z50BYJscOR2RyEnAJXZYe5RlTr3tpcGGzFnZ_fU';

export const supabase = createClient(supabaseUrl, supabaseKey);