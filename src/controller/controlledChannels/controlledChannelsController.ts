import { type Route, type MessageStructure } from "yau";
import {
  localRouteNameMap,
  type AvailableActions,
  type G,
} from "../_routeConsts";
import type { ControllerParams } from "../_types";
import { renderErrorMessage } from "../_general";
import { buildChannelPageMessages } from "./_views";

type MakeControlledChannelsRoutes = (p: ControllerParams) => {
  addControlledChannel: Route<G>["method"];
  listControlledChannels: Route<G>["method"];
  controlledChannel: Route<G>["method"];
  changeChannelActive: Exclude<
    Route<G>["actions"],
    undefined
  >[AvailableActions]["method"];
};

type ControlledChannelButton = {
  id: number;
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
      if ("error" in registeredResult && registeredResult.error !== undefined) {
        await renderErrorMessage(d, [
          "controlledChannelAdding",
          "s",
          "errors",
          registeredResult.error,
        ]);
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

    listControlledChannels: async (d) => {
      const pagingObject = await d.components.paging.buildSetup({
        loadPageData: async ({ offset, perPage, searchQuery }) =>
          services.controlledChannelService.listForUser(d.chat.id, {
            offset,
            perPage,
            searchQuery,
          }),
        loadCount: async ({ searchQuery }) =>
          services.controlledChannelService.countForUser(d.chat.id, {
            searchQuery,
          }),
      });

      if ("error" in pagingObject) {
        await renderErrorMessage(d, [
          "controlledChannelList",
          "s",
          "errors",
          pagingObject.error,
        ]);
        return;
      }

      const messages: MessageStructure[] = [
        {
          type: "text",
          text: "List of channels" + "\n\n" + pagingObject.helperMessage,
          inlineMarkup: [
            ...pagingObject.pageData.map((channelData) => [
              d.components.inlineButtons.buildState({
                type: localRouteNameMap.controlledChannel,
                text: channelData.name ?? "",
                data: { id: channelData.id } as ControlledChannelButton,
              }),
            ]),
            ...pagingObject.markup,
          ],
        } as const,
      ];
      d.render(messages);
    },

    controlledChannel: async (d) => {
      const channelId = (d.unitedData as ControlledChannelButton).id;
      const controlledChannel =
        await services.controlledChannelService.dataForChannelPage(channelId);

      if ("error" in controlledChannel) {
        await renderErrorMessage(d, [
          "controlledChannel",
          "s",
          "errors",
          controlledChannel.error,
        ]);
        return;
      }
      d.services.userStateService.addUserCurrentStateData({ id: channelId });

      d.render(buildChannelPageMessages(controlledChannel, d));
    },
    changeChannelActive: async (d) => {
      const channelId = (d.unitedData as ControlledChannelButton).id;
      const controlledChannel =
        await services.controlledChannelService.dataForChannelPage(channelId);
      if ("error" in controlledChannel) {
        await renderErrorMessage(d, [
          "controlledChannel",
          "s",
          "errors",
          controlledChannel.error,
        ]);
        return;
      }

      const result =
        await services.controlledChannelService.changeChannelActive(
          channelId,
          !controlledChannel.isActive
        );
      if ("error" in result) {
        await renderErrorMessage(d, [
          "controlledChannel",
          "s",
          "errors",
          result.error,
        ]);
        return;
      }

      controlledChannel.isActive = result.isActive;

      await d.notify({
        message: d.i18n.t([
          "controlledChannel",
          "s",
          "state",
          result.isActive ? "activated" : "deactivated",
        ]),
      });
      await d.render(buildChannelPageMessages(controlledChannel, d));
      return;
    },
  } as const;
};
