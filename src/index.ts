import dotenv from "dotenv";
import path from "path";

const dirname = path.resolve();
dotenv.config({ path: path.join(dirname, ".env") });

import ENV from "./env";

import initializeBot from "yau/src/core/botSetup";
import type { BotConfig } from "yau/src/core/types";
import { routes, type AvailableRoutes } from "./controller/routes";
import setupI18n from "yau/src/i18n/setup";

import configureI18n from "./public/i18n";

const i18n = setupI18n(configureI18n<"en">({ appName: ENV.APP_NAME }));

const botConfig: BotConfig<AvailableRoutes> = {
  routes,
  testTelegram: ENV.TEST_TELEGRAM === "true",
  i18n,
};

initializeBot(ENV.BOT_TOKEN, botConfig);
