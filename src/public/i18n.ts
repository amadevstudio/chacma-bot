import type { Dictionary } from "yau/src/i18n/setup";

type AvailableLanguages = "ru";

export default function configureI18n({
                                        appName
                                      }: {
  appName: string;
}): Dictionary<AvailableLanguages> {
  return {
    start: {
      s: {
        asd: {},
        message: {
          // en: `Welcome to ${appName}! This is the /start answer`,
          ru: `Добро пожаловать в ${appName}`
        },
      },
      n: {
        zxc: {
          numtest: {
            singular: {
              ru: "{0} облако, {1}"
            },
            few: {
              ru: "{0} облака, {1}"
            },
            many: {
              ru: "{0} облаков, {1}"
            }
          }
        }
      }
    }
  };
}

