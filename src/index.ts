import ENV from "./env";

import { makeRoutes } from "./controller/routes";

import configureI18n, { navigation } from "./public/i18n";
import { makeMiddlewares } from "./middleware/middlewares";
import { makeRepositories } from "./repository/repositories";
import { makeServices } from "./service/services";
import type { G } from "./controller/routeConsts";
import { setupI18n, type BotConfig, initializeBot } from "yau";
import initializeLogger from "./lib/logger";

const fallbackLanguageCode = "en";

const i18n = setupI18n(configureI18n({ appName: ENV.APP_NAME }), {
  fallbackLanguageCode: fallbackLanguageCode,
});

const logger = initializeLogger();

const repositories = makeRepositories({ baseUrl: "http://localhost:3000", logger });
const services = makeServices({ repositories, logger });
const middlewares = makeMiddlewares({ services, logger });
const routes = makeRoutes({ services, logger });

const botConfig: BotConfig<G> = {
  routes,
  defaultRoute: "menu",

  middlewares: middlewares,

  i18n,
  defaultTextGetters: {
    goBack: (languageCode) =>
      navigation.s.goBack[languageCode] ??
      navigation.s.goBack[fallbackLanguageCode],
  },

  testTelegram: ENV.TEST_TELEGRAM === "true",
  environment: ENV.ENVIRONMENT,
};

const bot = await initializeBot(ENV.BOT_TOKEN, ENV.REDIS_URL, botConfig);
bot.start();
