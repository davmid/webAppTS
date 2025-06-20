import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hlivjxwuxqujhoqwjriu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaXZqeHd1eHF1amhvcXdqcml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA5NjgsImV4cCI6MjA2NTk0Njk2OH0.k4moj7wrKnjzNdy2OPXHdN5IAowJL9414HsgjR8Lkgg'

export const supabase = createClient(supabaseUrl, supabaseKey)
