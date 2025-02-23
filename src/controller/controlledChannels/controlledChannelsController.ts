import { type Route, type MessageStructure } from "yau";
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
}) => {
  return {
    addControlledChannel: async (d) => {
      // Render base action
      if (d.isCallback || d.isCommand) {
        const messages: MessageStructure[] = [
          {
            type: "text",
            text: d.i18n.t(["controlledChannelAdding", "s", "message"]),
            inlineMarkup: d.components.goBack.buildLayout(),
          },
          {
            type: "text",
            text: d.i18n.t(["controlledChannelAdding", "s", "belowMessage"]),
            replyMarkup: [
              [
                {
                  text: d.i18n.t([
                    "controlledChannelAdding",
                    "s",
                    "addChannel",
                  ]),
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

      // Adding channel below
      const message = d.message!;
      type ChannelInfo = { id?: number; title?: string };

      const inputChannelInfo: ChannelInfo =
        message.forward_origin && "chat" in message.forward_origin
          ? message.forward_origin.chat
          : message.chat_shared
          ? {
              id: message.chat_shared.chat_id,
              title: message.chat_shared.title,
            }
          : { id: Number(message.text) };

      // Validate access
      const validationResult =
        await services.telegramChannelService.validateAccess(
          d.chat.id,
          inputChannelInfo.id!
        );
      if (validationResult.error !== undefined) {
        await d.render(
          d.components.emptyStateMessage({
            text: d.i18n.t(validationResult.error),
          })
        );
        await d.services.userStateService.addUserEmptyState();
        return;
      }

      const channelInfo = await services.telegramChannelService.getInfo(
        inputChannelInfo.id!
      );

      // Register
      const registeredResult = await services.controlledChannelService.create({
        ownerChatId: d.chat.id,
        channelId: inputChannelInfo.id!,
        isOwner: validationResult.isOwner,
        channelName: channelInfo.title!,
      });
      if ("error" in registeredResult) {
        await d.render(
          d.components.emptyStateMessage({
            text: d.i18n.t([
              "controlledChannelAdding",
              "s",
              "errors",
              "whileSaving",
            ]),
          })
        );
        return;
      }

      d.render([
        {
          type: "text",
          text: d.i18n.t(["controlledChannelAdding", "s", "addedMessage"], {
            vars: [String(channelInfo.id), channelInfo.title ?? ""],
          }),
          inlineMarkup: d.components.goBack.buildLayout(),
        } as const,
      ]);
    },

    listControlledChannels: async () => {},
  };
};
