import type { Dictionary } from "yau/src/i18n/setup";

type AvailableLanguages = "ru";

export default function configureI18n({
  appName,
}: {
  appName: string;
}): Dictionary<AvailableLanguages> {
  return {
    start: {
      s: {
        message: {
          // en: `Welcome to ${appName}! This is the /start answer`,
          ru: `Добро пожаловать в ${appName}`,
        },
      },
    },
  };
}
