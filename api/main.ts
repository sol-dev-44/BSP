/// <reference lib="deno.ns" />
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./routeStaticFilesFrom.ts";


const router = new Router();

// router.get("/api/geart", (context) => {
//     context.response.body = {}
// });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

await app.listen({ port: 8000 });