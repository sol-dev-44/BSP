// debug.ts - Deno compatible debug utility
// Run with: deno run --allow-read --allow-env debug.ts

/**
 * This script checks for common issues in your application
 * that could cause time slots or reservation creation to fail.
 * 
 * It checks:
 * 1. Environment variables
 * 2. Database schema relationships
 * 3. API endpoints
 * 4. Authentication flow
 */

console.log(`🔍 Starting debug utilities at ${new Date().toISOString()}`);

// Check if .env file exists and has required variables
async function checkEnvironmentVariables() {
  console.log("\n📋 Checking environment variables...");
  
  try {
    const envPath = "./debug.env";
    
    try {
      // Create a new .env file for debugging
      console.log("📝 Create a file named 'debug.env' with your environment variables for testing");
      console.log("⚠️ This file will NOT be used by your app, it's just for debugging");

      const fileExists = await Deno.stat(envPath).catch(() => false);
      
      if (!fileExists) {
        console.log("❌ debug.env file not found!");
        console.log("Create debug.env with these variables:");
        console.log(`
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ADMIN_API_KEY=your_admin_key
STRIPE_SECRET_KEY=your_stripe_key
VITE_STRIPE_PUBLIC_KEY=your_public_key
        `);
        return false;
      }
      
      const envContent = await Deno.readTextFile(envPath);
      const lines = envContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
      
      console.log(`Found ${lines.length} environment variables`);
      
      // Required variables for your app
      const requiredVars = [
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'ADMIN_API_KEY',
        'STRIPE_SECRET_KEY',
        'VITE_STRIPE_PUBLIC_KEY'
      ];
      
      const missingVars = [];
      
      requiredVars.forEach(varName => {
        if (!envContent.includes(`${varName}=`)) {
          missingVars.push(varName);
        } else {
          console.log(`✅ ${varName} found`);
        }
      });
      
      if (missingVars.length > 0) {
        console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
        return false;
      }
      
      console.log("✅ All required environment variables are present");
      
      // Check for empty values
      const emptyVars = [];
      lines.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        if (requiredVars.includes(key.trim()) && (!value || value.trim() === '')) {
          emptyVars.push(key.trim());
        }
      });
      
      if (emptyVars.length > 0) {
        console.error(`❌ The following variables have empty values: ${emptyVars.join(', ')}`);
        return false;
      }
      
      console.log("✅ No empty values in required variables");
      
      // Check for mismatched environment variable access
      console.log("\n⚠️ Environment variable access check:");
      console.log("Your codebase is using inconsistent methods to access environment variables:");
      console.log("- Some files use: process.env.ADMIN_API_KEY");
      console.log("- Some files use: Deno.env.get('ADMIN_API_KEY')");
      console.log("This inconsistency is likely causing your admin authentication to fail.");
      console.log("\nRecommended fix: Standardize on ONE method in ALL files:");
      console.log("For Deno: Always use Deno.env.get('VARIABLE_NAME')");
      
      return true;
    } catch (err) {
      console.error("Error reading env file:", err);
      return false;
    }
  } catch (err) {
    console.error("❌ Error checking environment variables:", err);
    return false;
  }
}

// Check database relationships and connections
async function checkDatabaseSchema() {
  console.log("\n📊 Checking database schema...");
  
  console.log("To verify the database schema in Supabase:");
  console.log("1. Check that the 'time_slots' and 'reservations' tables exist");
  console.log("2. Verify that reservations.time_slot_id is a foreign key to time_slots.id");
  console.log("3. Run the following SQL to inspect the relationship:");
  
  console.log(`
    -- Check if time_slots table exists
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'time_slots'
    );
    
    -- Check if reservations table exists
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'reservations'
    );
    
    -- Check foreign key relationship
    SELECT
      tc.table_schema, 
      tc.constraint_name, 
      tc.table_name, 
      kcu.column_name, 
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name 
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name='reservations'
      AND kcu.column_name='time_slot_id';
  `);
  
  console.log("Run this in your Supabase SQL editor");
}

// Check authentication flow
function checkAuthFlow() {
  console.log("\n🔐 Checking admin authentication flow...");
  
  // Check for common issues in authentication logic
  console.log(`
To resolve authentication issues:

1. Ensure consistent API key usage:
   - Use the same environment variable access method consistently
   - In Deno: Always use Deno.env.get("ADMIN_API_KEY") 
   - Check both timeSlotRoutes.ts and reservationRoutes.ts for consistency

2. Check admin login flow:
   - In AdminLogin.tsx, when the admin logs in, it should save the API key to localStorage
   - Make sure the key is correctly saved as 'adminApiKey' and not with a different name
   - Verify that the key is being properly read and sent in API requests

3. Add this temporary debugging code to your AdminLogin.tsx:

   const handleLogin = (e) => {
     e.preventDefault();
     const adminPin = import.meta.env.VITE_ADMIN_PIN;
     console.log('Comparing PIN:', { entered: pin, expected: adminPin, match: pin === adminPin });
     
     if (pin === adminPin) {
       console.log('✅ Login successful, setting adminApiKey to:', pin);
       localStorage.setItem('adminApiKey', pin);
       dispatch(loginSuccess());
       navigate('/management-console');
     } else {
       dispatch(loginFailure('Invalid PIN. Please try again.'));
     }
   };

4. Add this debugging to your timeSlotsApi.ts createTimeSlots method:

   createTimeSlots: builder.mutation<
     { message: string; slots: TimeSlot[] },
     {
       // params as before
     }
   >({
     query: (data) => {
       const token = localStorage.getItem("adminApiKey");
       console.log('Creating time slots with auth token:', token ? 'present' : 'missing');
       
       return {
         url: "api/admin/time-slots",
         method: "POST",
         body: data,
         headers: {
           Authorization: \`Bearer \${localStorage.getItem("adminApiKey")}\`,
         },
       };
     },
     invalidatesTags: ["TimeSlot"],
   }),
  `);
}

// Check if the API requests are properly formatted
function checkAPIRequests() {
  console.log("\n🌐 Checking API request formatting...");
  
  console.log(`
To verify API requests:

1. Open your browser's Developer Tools (F12)
2. Go to the Network tab
3. Attempt to create a time slot or reservation
4. Look for the corresponding API request:
   - For time slots: POST to /api/admin/time-slots
   - For reservations: POST to /api/admin/reservations/create

5. Check the following:
   
   a. Request Headers:
      - Authorization: Bearer [your admin key]
      - Content-Type: application/json
   
   b. Request Payload (for time slots):
      - If creating a single slot, verify it has:
        {
          "slots": [
            {
              "start_time": "...",
              "end_time": "...",
              "capacity": 10,
              "status": "available"
            }
          ]
        }
      
      - If creating from range, verify it has:
        {
          "startDate": "...",
          "endDate": "...",
          "startHour": 9,
          "endHour": 10,
          "slotDuration": 60,
          "capacity": 10,
          "skipDays": []
        }
   
   c. Response:
      - Check for any error messages
      - Successful response should have status 201 with message and slots array
  `);
}

// Run all checks
async function runDebugChecks() {
  await checkEnvironmentVariables();
  await checkDatabaseSchema();
  checkAuthFlow();
  checkAPIRequests();
  
  console.log("\n📝 Additional steps to try:");
  console.log("1. Add more detailed logging on both frontend and backend");
  console.log("2. Add a test endpoint in timeSlotRoutes.ts to verify basic connectivity");
  console.log("3. Verify database foreign key constraints");
  console.log("4. Check that time slot IDs are correctly passed between components");
  console.log("5. Try dropping and recreating tables in Supabase with proper relationships");
  
  console.log("\n💡 Sample SQL to recreate tables with proper relationships:");
  console.log(`
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS time_slots;

-- Create time_slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER NOT NULL,
  booked_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (
    status IN ('available', 'partially_booked', 'fully_booked', 'weather_blocked')
  ),
  weather_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table with proper foreign key
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_slot_id UUID NOT NULL REFERENCES time_slots(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  number_of_people INTEGER NOT NULL,
  riders INTEGER,
  photo_package BOOLEAN DEFAULT FALSE,
  go_pro_package BOOLEAN DEFAULT FALSE,
  tshirts INTEGER,
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'refunded', 'completed', 'weather_cancelled')
  ),
  payment_intent_id TEXT,
  payment_amount INTEGER,
  refund_id TEXT,
  refund_amount INTEGER,
  cancellation_reason TEXT,
  notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for updating the time_slots status
CREATE OR REPLACE FUNCTION update_time_slot_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When a reservation changes status (confirmed, cancelled, etc.)
  IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
    -- Update booked_count and status for the time slot
    UPDATE time_slots
    SET 
      booked_count = (
        SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
        FROM reservations
        WHERE time_slot_id = NEW.time_slot_id
        AND status IN ('confirmed', 'pending')
      ),
      status = CASE 
        WHEN status = 'weather_blocked' THEN 'weather_blocked'
        WHEN (
          SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
          FROM reservations
          WHERE time_slot_id = NEW.time_slot_id
          AND status IN ('confirmed', 'pending')
        ) >= capacity THEN 'fully_booked'
        WHEN (
          SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
          FROM reservations
          WHERE time_slot_id = NEW.time_slot_id
          AND status IN ('confirmed', 'pending')
        ) > 0 THEN 'partially_booked'
        ELSE 'available'
      END,
      updated_at = NOW()
    WHERE id = NEW.time_slot_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reservations
CREATE TRIGGER update_time_slot_on_reservation
AFTER INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_time_slot_status();

-- Add a function to handle expired pending reservations
CREATE OR REPLACE FUNCTION expire_pending_reservations()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  WITH expired AS (
    UPDATE reservations
    SET status = 'cancelled', cancellation_reason = 'Payment window expired'
    WHERE status = 'pending'
    AND expires_at < NOW()
    RETURNING time_slot_id
  )
  SELECT COUNT(*) INTO expired_count FROM expired;
  
  -- Update the affected time slots
  UPDATE time_slots
  SET 
    booked_count = (
      SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
      FROM reservations
      WHERE time_slot_id = time_slots.id
      AND status IN ('confirmed', 'pending')
    ),
    status = CASE 
      WHEN status = 'weather_blocked' THEN 'weather_blocked'
      WHEN (
        SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
        FROM reservations
        WHERE time_slot_id = time_slots.id
        AND status IN ('confirmed', 'pending')
      ) >= capacity THEN 'fully_booked'
      WHEN (
        SELECT COALESCE(SUM(number_of_people + COALESCE(riders, 0)), 0)
        FROM reservations
        WHERE time_slot_id = time_slots.id
        AND status IN ('confirmed', 'pending')
      ) > 0 THEN 'partially_booked'
      ELSE 'available'
    END,
    updated_at = NOW()
  WHERE id IN (
    SELECT time_slot_id FROM reservations
    WHERE status = 'cancelled'
    AND cancellation_reason = 'Payment window expired'
    AND updated_at > NOW() - INTERVAL '5 minutes'
  );
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;
  `);
  
  console.log("\n🏁 Debug check complete");
}

// Execute the debug process
await runDebugChecks().catch(err => {
  console.error("Fatal error during debugging:", err);
});