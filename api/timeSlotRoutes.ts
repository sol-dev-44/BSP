import { Router } from "@oak/oak";
import {
  blockTimeSlotsDueToWeather,
  createTimeSlots,
  generateTimeSlotsFromRange,
} from "./supabase/reservationActions.ts";
import { supabase } from "./supabase/client.ts";

const router = new Router();

// Helper for consistent admin auth check with detailed logging
const checkAdminAuth = (authHeader: string | null): boolean => {
  // Get admin key consistently
  const adminKey = Deno.env.get("ADMIN_API_KEY") || process.env.ADMIN_API_KEY || "";
  
  console.log("🔑 Admin auth check:", {
    headerPresent: !!authHeader,
    isBearer: authHeader?.startsWith("Bearer ") || false,
    envKeyLength: adminKey.length,
    keyMatches: authHeader === `Bearer ${adminKey}`,
  });
  
  return !!authHeader && authHeader === `Bearer ${adminKey}`;
};

router
  // Delete a time slot (admin only)
  .delete("/api/admin/time-slots/:id", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!checkAdminAuth(authHeader)) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      const id = ctx.params.id;
      if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Time slot ID is required" };
        return;
      }

      // Check if this is a force delete operation
      const forceDelete = ctx.request.url.searchParams.get("force") === "true";

      // If not a force delete, check for active reservations
      if (!forceDelete) {
        // Check if time slot has any ACTIVE reservations only
        // This allows deletion if there are only canceled/refunded reservations
        const { data: activeReservations, error: reservationError } =
          await supabase
            .from("reservations")
            .select("id, status")
            .eq("time_slot_id", id)
            .not("status", "in", '("cancelled","refunded","weather_cancelled")')
            .limit(5);

        if (reservationError) {
          ctx.response.status = 500;
          ctx.response.body = { error: reservationError.message };
          return;
        }

        // Don't allow deletion if there are active reservations
        if (activeReservations && activeReservations.length > 0) {
          ctx.response.status = 400;
          ctx.response.body = {
            error: `Cannot delete time slot with active reservations (${
              activeReservations.map((r) => r.status).join(", ")
            }). Use force delete if necessary.`,
            success: false,
          };
          return;
        }
      }

      // Now handle all existing reservations for this time slot
      if (forceDelete) {
        // For force delete, first mark all reservations as cancelled
        const { error: cancelError } = await supabase
          .from("reservations")
          .update({
            status: "cancelled",
            cancellation_reason: "Time slot was forcibly deleted by admin",
          })
          .eq("time_slot_id", id);

        if (cancelError) {
          console.warn(
            "Error cancelling reservations during force delete:",
            cancelError,
          );
          // Continue with deletion anyway since it's a force delete
        }
      }

      // Delete the time slot
      const { error } = await supabase
        .from("time_slots")
        .delete()
        .eq("id", id);

      if (error) {
        ctx.response.status = 500;
        ctx.response.body = {
          error: error.message,
          success: false,
        };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        message: forceDelete
          ? "Time slot force deleted successfully"
          : "Time slot deleted successfully",
      };
    } catch (error) {
      console.error("❌ Error deleting time slot:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Failed to delete time slot",
        success: false,
      };
    }
  })
  // Get time slots (with option to include booked slots)
  .get("/api/time-slots", async (ctx) => {
    try {
      // Get days parameter from query string (default to 365)
      const days = ctx.request.url.searchParams.get("days");
      const daysAhead = days ? parseInt(days) : 365;

      // Get includeBooked parameter from query string (default to false)
      const includeBooked =
        ctx.request.url.searchParams.get("includeBooked") === "true";

      console.log("🔍 Fetching time slots:", {
        daysAhead,
        includeBooked,
      });

      // Get the date range
      const now = new Date();
      const future = new Date();
      future.setDate(now.getDate() + daysAhead);

      // Build query
      let query = supabase
        .from("time_slots")
        .select("*")
        .gte("start_time", now.toISOString())
        .lte("start_time", future.toISOString())
        .order("start_time", { ascending: true });

      // Only exclude fully booked slots if includeBooked is false
      if (!includeBooked) {
        query = query
          .not("status", "eq", "fully_booked")
          .not("status", "eq", "weather_blocked");
      }

      // Execute query
      const { data, error } = await query;

      if (error) {
        console.error("❌ Error fetching time slots:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: error.message };
        return;
      }

      console.log(`✅ Successfully fetched ${data?.length || 0} time slots`);
      ctx.response.body = data;
    } catch (error) {
      console.error("❌ Error fetching time slots:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to fetch time slots" };
    }
  })
  // Create time slots (admin only)
  .post("/api/admin/time-slots", async (ctx) => {
    try {
      // Enhanced auth check with debugging
      const authHeader = ctx.request.headers.get("Authorization");
      if (!checkAdminAuth(authHeader)) {
        console.error("❌ Admin authentication failed for time slot creation");
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      console.log("✅ Admin authentication successful for time slot creation");

      if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "No data provided" };
        return;
      }

      const value = await ctx.request.body.json();
      console.log("📝 Received time slot creation data:", value);

      let timeSlots;

      // Direct slots creation
      if (value.slots) {
        timeSlots = value.slots;
        console.log(`Creating ${timeSlots.length} direct time slots`);
      } // Generate slots from range
      else if (value.startDate && value.endDate) {
        console.log("Generating time slots from date range:", {
          start: value.startDate,
          end: value.endDate,
        });
        
        timeSlots = generateTimeSlotsFromRange(
          new Date(value.startDate),
          new Date(value.endDate),
          value.startHour || 9,
          value.endHour || 17,
          value.slotDuration || 60,
          value.capacity || 10,
          value.skipDays || [],
        );
        console.log(`Generated ${timeSlots.length} time slots from range`);
      } else {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid request format" };
        return;
      }

      console.log("🔄 Creating time slots in database...");
      const result = await createTimeSlots(timeSlots);

      if (typeof result === "string") {
        console.error("❌ Error creating time slots:", result);
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      console.log(`✅ Successfully created ${result.length} time slots`);
      ctx.response.status = 201;
      ctx.response.body = {
        message: `Created ${result.length} time slots`,
        slots: result,
      };
    } catch (error) {
      console.error("❌ Error creating time slots:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to create time slots: " + (error instanceof Error ? error.message : String(error)) };
    }
  })
  // Block time slots due to weather (admin only)
  .post("/api/admin/time-slots/weather-block", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (!checkAdminAuth(authHeader)) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
      }

      if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = { error: "No data provided" };
        return;
      }

      const value = await ctx.request.body.json();

      if (
        !value.slotIds || !Array.isArray(value.slotIds) ||
        value.slotIds.length === 0
      ) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Slot IDs are required" };
        return;
      }

      const weatherStatus = value.weatherStatus ||
        "Weather conditions unsuitable for parasailing";

      const result = await blockTimeSlotsDueToWeather(
        value.slotIds,
        weatherStatus,
      );

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = {
        message: `Blocked ${result.length} time slots due to weather`,
        slots: result,
      };
    } catch (error) {
      console.error("❌ Error blocking time slots due to weather:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to block time slots" };
    }
  });

export default router;