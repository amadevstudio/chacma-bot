import type { Dictionary } from "yau/src/i18n/setup";

export default function <AvailableLanguages extends string = string>({
  appName,
}: {
  appName: string;
}): Dictionary<AvailableLanguages> {
  return {
    start: {
      message: {
        en: `Welcome to ${appName}! This is the /start answer`,
      },
    },
  };
}
