import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Define the Supabase URL and anon key directly to ensure they're available
const supabaseUrl = 'https://kpmmhyfalflkuranmdgp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbW1oeWZhbGZsa3VyYW5tZGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NTc4MjEsImV4cCI6MjA1NjAzMzgyMX0.8wDQnM5WbDcuK5Ofn4QxjzZ3YzMVNYxcjy_41-24xtQ'

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
        