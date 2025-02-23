import { TeleError, TeleErrors } from "yau";
import type { TgServiceParams } from "./_types";

type ChatMember = "creator" | "administrator";

export function makeTelegramChannelService({
  bot,
  logger,
  repositories,
  consts,
}: TgServiceParams) {
  return {
    async getInfo(channelId: number) {
      return await bot.api.getChat(channelId);
    },
    async validateAccess(ownerChatId: number, addingChannelId: number) {
      try {
        // Validate if bot can post messages
        const botInChat = await bot.api.getChatMember(
          addingChannelId,
          bot.botInfo.id
        );
        if (
          botInChat.status !== "administrator" ||
          (botInChat.can_post_messages ?? false) === false
        ) {
          return {
            error: [
              "controlledChannelAdding",
              "s",
              "errors",
              "botCantPostMessages",
            ],
          };
        }

        // Validate if owner or admin with post privileges
        const adminOfChannel = await bot.api.getChatMember(
          addingChannelId,
          ownerChatId
        );
        if (
          adminOfChannel.status !== "creator" &&
          (adminOfChannel.status !== "administrator" ||
            (adminOfChannel.status === "administrator" &&
              adminOfChannel.can_post_messages === false))
        ) {
          return {
            error: ["controlledChannelAdding", "s", "errors", "notAdmin"],
          };
        }
        const channelMemberStatus = adminOfChannel.status as ChatMember;

        // Validate only admin can create chats (get first if not admin)
        const currentChannel =
          await repositories.controlledChannelRepository.findByServiceId({
            serviceId: String(addingChannelId),
            serviceType: consts.serviceType,
          });
        if (currentChannel && channelMemberStatus !== "creator") {
          return {
            error: [
              "controlledChannelAdding",
              "s",
              "errors",
              "onlyOwnerCanAdd",
            ],
          };
        }

        // TODO: Validate if bot payed

        return { isOwner: channelMemberStatus === "creator" };
      } catch (e: typeof TeleError | unknown) {
        if (
          e instanceof TeleError &&
          e.error_code === TeleErrors.CHAT_NOT_FOUND
        ) {
          return {
            error: ["controlledChannelAdding", "s", "errors", "chatNotFound"],
          };
        } else {
          logger.error(e);
          return {
            error: ["controlledChannelAdding", "s", "errors", "genericError"],
          };
        }
      }
    },
  };
}
