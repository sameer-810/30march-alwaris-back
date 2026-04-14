import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDb(maxRetries = 5) {
  mongoose.set("strictQuery", true);

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      logger.info("MongoDB connected successfully");
      return;
    } catch (error) {
      attempt++;

      const delay = Math.min(1000 * 2 ** attempt, 10000);

      logger.warn(
        { err: error },
        `MongoDB connection attempt ${attempt} failed. Retrying in ${delay}ms...`,
      );

      if (attempt >= maxRetries) {
        logger.error(
          { err: error },
          "Max retries reached. Could not connect to MongoDB.",
        );
        process.exit(1);
      }

      await wait(delay);
    }
  }
}

export { connectDb };
