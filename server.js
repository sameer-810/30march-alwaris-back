const http = require("http");
const app = require("./src/app");
const { env } = require("./src/config/env");
const { connectDb } = require("./src/config/db");

async function bootstrap() {
  await connectDb();
  console.log("Connected to MongoDB");

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    console.log(`API listening on :${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
