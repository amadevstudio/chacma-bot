import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  BOT_TOKEN: z.string(),
  TEST_TELEGRAM: z.string(),

  APP_NAME: z.string(),
});

export default envSchema.parse(process.env);
