// timeSlotRoutes.ts
import { Router } from "@oak/oak";
import {
  blockTimeSlotsDueToWeather,
  createTimeSlots,
  generateTimeSlotsFromRange,
} from "./supabase/reservationActions.ts";
import { supabase } from "./supabase/client.ts";

const router = new Router();

router
  // Get time slots (with option to include booked slots)
  .get("/api/time-slots", async (ctx) => {
    try {
      // Get days parameter from query string (default to 30)
      const days = ctx.request.url.searchParams.get("days");
      const daysAhead = days ? parseInt(days) : 30;
      
      // Get includeBooked parameter from query string (default to false)
      const includeBooked = ctx.request.url.searchParams.get("includeBooked") === "true";

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
        ctx.response.status = 500;
        ctx.response.body = { error: error.message };
        return;
      }

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
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (
        !authHeader ||
        authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`
      ) {
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

      let timeSlots;

      // Direct slots creation
      if (value.slots) {
        timeSlots = value.slots;
      } // Generate slots from range
      else if (value.startDate && value.endDate) {
        timeSlots = generateTimeSlotsFromRange(
          new Date(value.startDate),
          new Date(value.endDate),
          value.startHour || 9,
          value.endHour || 17,
          value.slotDuration || 60,
          value.capacity || 10,
          value.skipDays || [],
        );
      } else {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid request format" };
        return;
      }

      const result = await createTimeSlots(timeSlots);

      if (typeof result === "string") {
        ctx.response.status = 500;
        ctx.response.body = { error: result };
        return;
      }

      ctx.response.status = 201;
      ctx.response.body = {
        message: `Created ${result.length} time slots`,
        slots: result,
      };
    } catch (error) {
      console.error("❌ Error creating time slots:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to create time slots" };
    }
  })
  // Block time slots due to weather (admin only)
  .post("/api/admin/time-slots/weather-block", async (ctx) => {
    try {
      // Basic auth check
      const authHeader = ctx.request.headers.get("Authorization");
      if (
        !authHeader ||
        authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`
      ) {
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