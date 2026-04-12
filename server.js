const http = require("http");
const app = require("./src/app");
const { env } = require("./src/config/env");
const { connectDb } = require("./src/config/db");
const { logger } = require("./src/config/logger");

async function bootstrap() {
  await connectDb();
  logger.info("Connected to MongoDB");

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API listening");
  });
}

bootstrap().catch((err) => {
  logger.fatal(err, "Failed to start server");
  process.exit(1);
});
