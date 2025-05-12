// supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables - use process.env for Node.js
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

console.log("Initializing Supabase with URL:", supabaseUrl ? "URL found" : "URL missing");

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Confirm Supabase connection on application startup
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("time_slots").select("count");
    if (error) {
      console.error("❌ Error connecting to Supabase:", error);
    } else {
      console.log("✅ Successfully connected to Supabase");
    }
  } catch (err) {
    console.error("❌ Unexpected error connecting to Supabase:", err);
  }
};

// Run the connection check
checkSupabaseConnection();