import http from "http";
import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDb } from "./src/config/db.js";
import { logger } from "./src/config/logger.js";

async function bootstrap() {
  await connectDb();

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API listening");
  });
}

bootstrap().catch((err) => {
  logger.fatal(err, "Failed to start server");
  process.exit(1);
});
