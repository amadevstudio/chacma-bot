import type { Dictionary } from "yau/src/i18n/setup";

type AvailableLanguages = "ru";

const navigation = {
  s: {
    goBack: {
      en: "<< Go back",
      ru: "<< Назад",
    },
  },
};

function makeStart(appName: string) {
  return {
    s: {
      message: {
        // en: `Welcome to ${appName}! This is the /start answer`,
        ru: `Добро пожаловать в ${appName}`,
      },
    },
  };
}

export default function configureI18n({
  appName,
}: {
  appName: string;
}): Dictionary<AvailableLanguages> {
  return {
    navigation,

    start: makeStart(appName),
  };
}
