import type { Route, MessageStructure } from "yau";
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
        ] as const;

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

      return;

      // Validate access
      // services.controlledChannelService.v

      try {
        const registeredResult = services.controlledChannelService.createChannel();
      } catch (e) {
        logger.error(e);
        // d.render()
        return;
      }

      // get chanenl fron tg

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
