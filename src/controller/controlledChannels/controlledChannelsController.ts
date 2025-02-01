import type { Route, MessageStructure } from "yau";
import type { MakeServices } from "../../service/services";
import type { G } from "../routeConsts";

type MakeControlledChannelsRoutes = (p: {
  services: ReturnType<MakeServices>;
}) => {
  [key in
    | "addControlledChannel"
    | "listControlledChannels"]: Route<G>["method"];
};

export const makeControlledChannelsRoutes: MakeControlledChannelsRoutes =
  () => {
    return {
      addControlledChannel: async (d) => {
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
      },

      listControlledChannels: async () => {},
    };
  };
