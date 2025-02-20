import { TeleError, TeleErrors } from "yau";
import type { TgServiceParams } from "./_types";

export function makeTelegramChannelService({ bot, logger }: TgServiceParams) {
  return {
    async getChannelInfoById(channelId: string | number) {
      try {
        return bot.api.getChat(channelId);
      } catch (e: typeof TeleError | unknown) {
        if (
          e instanceof TeleError &&
          e.error_code === TeleErrors.CHAT_NOT_FOUND
        ) {
          // TODO: use i18n
          return {
            error:
              "The specified chat was not found. The bot should be added as a channel admin and should not be blocked.",
          };
        } else {
          logger.error(e);
          return {
            error:
              "An error occurred while retrieving the channel information.",
          };
        }
      }
    },
  };
}
