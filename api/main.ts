// main.ts
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import timeSlotRoutes from "./timeSlotRoutes.ts";
import reservationRoutes from "./reservationRoutes.ts";
import routeStaticFilesFrom from "./routeStaticFilesFrom.ts";
import dotenv from "dotenv";


// Load environment variables
dotenv.config();

// Initialize the app
const app = new Application();

// Global error listener
app.addEventListener("error", (evt) => {
  console.log("🚨 Global error:", {
    error: evt.error,
    message: evt.error.message,
    stack: evt.error.stack,
  });
});

// CORS middleware
app.use(oakCors());

// Use the modular routes
app.use(timeSlotRoutes.routes());
app.use(timeSlotRoutes.allowedMethods());
app.use(reservationRoutes.routes());
app.use(reservationRoutes.allowedMethods());

// Static files handler - using the dedicated function
const staticPaths = ["./dist", "dist", "/dist"];
app.use(routeStaticFilesFrom(staticPaths));

// SPA handler
app.use(async (ctx) => {
  const path = ctx.request.url.pathname;
  console.log("🌐 SPA handler for path:", path);

  if (!path.startsWith("/api") && !path.startsWith("/ws")) {
    try {
      console.log("📝 Attempting to serve index.html for path:", path);
      // Try multiple possible roots
      const roots = ["./dist", "dist", "/dist"];
      let served = false;

      for (const root of roots) {
        try {
          await ctx.send({
            root,
            path: "index.html",
            index: "index.html",
          });
          console.log("✅ Successfully served index.html from", root);
          served = true;
          break;
        } catch (e) {
          console.log(`📁 Attempted ${root}, trying next...`);
        }
      }

      if (!served) {
        throw new Error("Could not serve index.html from any root");
      }
    } catch (error) {
      console.error("💥 Error serving index.html for path:", path);
      console.error("Error details:", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      ctx.response.status = 500;
      ctx.response.body = "Server error";
    }
  }
});

// Dynamically set port based on environment
const PORT = Deno.env.get("PORT") ? Number(Deno.env.get("PORT")) : 8000;

// Print Stripe configuration
console.log(`🔑 Stripe configuration: API key ${Deno.env.get("STRIPE_SECRET_KEY") ? "is set" : "is MISSING"}`);
console.log(`🔑 Stripe public key: ${Deno.env.get("VITE_STRIPE_PUBLIC_KEY") ? "is set" : "is MISSING"}`);

// Listen with a more flexible configuration
console.log(`🚀 Starting server on port ${PORT}...`);
await app.listen({
  port: PORT,
  // Remove explicit hostname for Deno Deploy compatibility
});

console.log(
  `🚀 Server is running on ${
    Deno.env.get("DENO_DEPLOYMENT_ID")
      ? "Deno Deploy"
      : `http://localhost:${PORT}`
  }`,
);