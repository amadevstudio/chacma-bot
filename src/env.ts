import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  BOT_TOKEN: z.string(),
  TEST_TELEGRAM: z.string(),

  APP_NAME: z.string(),

  REDIS_URL: z.string().url(),

  ENVIRONMENT: z.enum(["development", "production"]),
});

export default envSchema.parse(process.env);
