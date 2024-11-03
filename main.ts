/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from "fresh";
import { define, type State } from "./lib/utils.ts";

export const app = new App<State>();
app.use(staticFiles());

// app.get("/api2/:name", (ctx) => {
//   const name = ctx.params.name;
//   return new Response(
//     `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
//   );
// });

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
