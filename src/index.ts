import ENV from "./env";

import { makeRoutes } from "./controller/routes";

import configureI18n, { navigation } from "./public/i18n";
import { makeMiddlewares } from "./middleware/_middlewares";
import { makeRepositories } from "./repository/_repositories";
import { makeServices } from "./service/_services";
import type { G } from "./controller/routeConsts";
import { setupI18n, type InitializeSystemConfig, initializeBot } from "yau";
import initializeLogger from "./lib/logger";
import { createDbConnection } from "./db/drizzle";
import type { TeleBot } from "yau";

const fallbackLanguageCode = "en";

const i18n = setupI18n(configureI18n({ appName: ENV.APP_NAME }), {
  fallbackLanguageCode: fallbackLanguageCode,
});

const logger = initializeLogger();

const db = createDbConnection({ logger });

const initializeProject = (bot: TeleBot) => {
  const repositories = makeRepositories({
    baseUrl: "http://localhost:3000",
    logger,
    db,
  });
  const services = makeServices({ repositories, logger, bot });
  const middlewares = makeMiddlewares({ services, logger });
  const routes = makeRoutes({ services, logger });
  return { routes, middlewares };
};

const botConfig: InitializeSystemConfig<G> = {
  initializeProject,

  defaultRoute: "menu",

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
