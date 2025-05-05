// main.ts
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

// Set up router
const router = new Router();

const app = new Application();

// Global error listener
app.addEventListener("error", (evt) => {
  console.log("🚨 Global error:", {
    error: evt.error,
    message: evt.error.message,
    stack: evt.error.stack,
  });
});


// API routes
app.use(router.routes());
app.use(router.allowedMethods());

// Static files handler
app.use(async (ctx, next) => {
  const path = ctx.request.url.pathname;
  console.log("🔍 Request path:", path);
  console.log(
    "💻 Environment:",
    Deno.env.get("DENO_DEPLOYMENT_ID") ? "Production" : "Local",
  );

  try {
    // If it looks like a static asset, try to serve it
    if (path.startsWith("/assets/") || path.includes(".")) {
      try {
        // Try multiple possible roots
        const roots = ["./dist", "dist", "/dist"];
        let served = false;

        for (const root of roots) {
          try {
            await ctx.send({
              root,
              path,
            });
            console.log("📦 Successfully served static file from", root + path);
            served = true;
            break;
          } catch (e) {
            console.log(`📁 Attempted ${root}, trying next...`);
          }
        }

        if (!served) {
          throw new Error("Could not serve from any root");
        }
        return;
      } catch (error) {
        console.error("❌ Static file error for path:", path, error);
        await next();
      }
    } else {
      await next();
    }
  } catch (error) {
    console.error("💥 Middleware error:", error);
    await next();
  }
});

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

// Listen with a more flexible configuration
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
