import ENV from "./env";

import initializeBot from "yau/src/core/botSetup";
import type { BotConfig } from "yau/src/core/types";
import {
  type AvailableActions,
  type AvailableRoutes,
  routes,
} from "./controller/routes";
import setupI18n from "yau/src/i18n/setup";

import configureI18n from "./public/i18n";

const i18n = setupI18n(configureI18n({ appName: ENV.APP_NAME }), {
  fallbackLanguageCode: "ru",
});

const botConfig: BotConfig<AvailableRoutes, AvailableActions> = {
  routes,
  defaultRoute: "start",

  i18n,
  defaultTextKeys: {
    goBack: ["navigation", "s", "goBack"],
  },

  testTelegram: ENV.TEST_TELEGRAM === "true",
  environment: ENV.ENVIRONMENT,
};

(await initializeBot(ENV.BOT_TOKEN, ENV.REDIS_URL, botConfig)).start();
