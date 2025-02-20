import { type Route, type MessageStructure, TeleError, TeleErrors } from "yau";
import type { MakeServices } from "../../service/_services";
import type { G } from "../routeConsts";
import type { ProjectLogger } from "../../lib/logger";

type MakeControlledChannelsRoutes = (p: {
  services: ReturnType<MakeServices>;
  logger: ProjectLogger;
}) => {
  [key in
    | "addControlledChannel"
    | "listControlledChannels"]: Route<G>["method"];
};

export const makeControlledChannelsRoutes: MakeControlledChannelsRoutes = ({
  services,
  logger,
}) => {
  return {
    addControlledChannel: async (d) => {
      // Render base action
      if (d.isCallback || d.isCommand) {
        const messages: MessageStructure[] = [
          {
            type: "text",
            text: "Add channel",
            inlineMarkup: d.components.goBack.buildLayout(),
          },
          {
            type: "text",
            text: "Push the button",
            replyMarkup: [
              [
                {
                  text: "Add channel",
                  request_chat: {
                    request_id: 1,
                    chat_is_channel: true,
                    bot_is_member: true,
                  },
                },
              ],
            ],
            inlineMarkup: d.components.goBack.buildLayout(),
          },
        ];
        await d.render(messages);
        return;
      }

      const message = d.message!;
      type ChannelInfo = { id?: number | string; title?: string };

      const channelInfo: ChannelInfo =
        message.forward_origin && "chat" in message.forward_origin
          ? message.forward_origin.chat
          : message.chat_shared
          ? {
              id: message.chat_shared.chat_id,
              title: message.chat_shared.title,
            }
          : { id: message.text };

      // Validate access
      const channel = await services.telegramChannelService.getChannelInfoById(
        channelInfo.id!
      );
      if ("error" in channel) {
        await d.render(d.components.emptyStateMessage({ text: channel.error }));
        await d.services.userStateService.addUserEmptyState();
        return;
      }

      // Register
      const registeredResult =
        await services.controlledChannelService.createChannel({
          ownerChatId: d.chat.id,
          channelId: channel.id,
        });
      if ("error" in registeredResult) {
        await d.render(
          d.components.emptyStateMessage({
            text: "An error occurred while saving the channel.",
          })
        );
      }

      d.render([
        {
          type: "text",
          text: `Channel id ${channelInfo.id} title ${channelInfo.title} is added`,
          inlineMarkup: d.components.goBack.buildLayout(),
        } as const,
      ]);
    },

    listControlledChannels: async () => {},
  };
};
