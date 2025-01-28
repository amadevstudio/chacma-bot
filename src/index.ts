import ENV from "./env";

import initializeBot from "yau/src/core/botSetup";
import type { BotConfig } from "yau/src/core/types";
import {
  type AvailableActions,
  type AvailableRoutes,
  makeRoutes
} from "./controller/routes";
import setupI18n from "yau/src/i18n/setup";

import configureI18n, {
  navigation,
  type AvailableLanguages,
} from "./public/i18n";
import { makeMiddlewares } from "./middleware/middlewares";
import { makeRepositories } from "./repository/repositories";
import { makeServices } from "./service/services";

const fallbackLanguageCode = "en";

const i18n = setupI18n(configureI18n({ appName: ENV.APP_NAME }), {
  fallbackLanguageCode: fallbackLanguageCode,
});

const repositories = makeRepositories({ baseUrl: "http://localhost:3000" });
const services = makeServices({ repositories });
const middlewares = makeMiddlewares({ services });
const routes = makeRoutes({ services });

const botConfig: BotConfig<
  AvailableRoutes,
  AvailableActions,
  AvailableLanguages
> = {
  routes,
  defaultRoute: "menu",

  middlewares: middlewares,

  i18n,
  defaultTextGetters: {
    goBack: (languageCode: AvailableLanguages) =>
      navigation.s.goBack[languageCode] ??
      navigation.s.goBack[fallbackLanguageCode],
  },

  testTelegram: ENV.TEST_TELEGRAM === "true",
  environment: ENV.ENVIRONMENT,
};

(await initializeBot(ENV.BOT_TOKEN, ENV.REDIS_URL, botConfig)).start();
