// import { createClient } from '@supabase/supabase-js'
const { createClient } = require("@supabase/supabase-js");

// Replace with your actual values
const SUPABASE_URL = 'https://tuvathnuygftcqflnxdx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dmF0aG51eWdmdGNxZmxueGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Njk3MzksImV4cCI6MjA3NzE0NTczOX0.mMQChK5VLW2qMPuHwJRaR6gE-P-pWKm1Ip5Z4TrcjdA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase }  