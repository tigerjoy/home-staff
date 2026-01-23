const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qmsedptrtwoxnvimabte.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtc2VkcHRydHdveG52aW1hYnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzU3MjAsImV4cCI6MjA4NDI1MTcyMH0.6UB8QfA1aWPxt2FitKXlkkVt-VefWjJlIJwebO0odcA'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey
