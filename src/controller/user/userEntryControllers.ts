import type { MessageStructure, ControllerConstructedParams, Route } from "yau";
import { localRouteNameMap, type G } from "../routeConsts";

type MenuData = {
  fromStart?: boolean;
};

type MakeUserEntryRoutes = () => {
  [key in "start" | "menu" | "terms"]: Route<G>["method"];
};

export function makeUserEntryRoutes(): ReturnType<MakeUserEntryRoutes> {
  return {
    start: async (d) => {
      const messages: MessageStructure[] = [
        {
          type: "text",
          text: d.i18n.t(["start", "s", "message"]),
          inlineMarkup: [
            [
              d.components.buildButton(
                localRouteNameMap.menu,
                d.i18n.t(["start", "s", "openMenu"]),
                {
                  fromStart: true,
                } as MenuData
              ),
            ],
          ],
        },
      ] as const;

      await d.render(messages);
    },

    menu: async (d: ControllerConstructedParams) => {
      const isFromStart = (d.unitedData as MenuData).fromStart === true;

      const messages: MessageStructure[] = [
        {
          type: "text",
          text:
            (isFromStart
              ? d.i18n.t(["menu", "s", "fromStartMessage"]) + "\n\n"
              : "") + d.i18n.t(["menu", "s", "message"]),
          inlineMarkup: [
            [
              d.components.buildButton(
                localRouteNameMap.addControlledChannel,
                d.i18n.t(["menu", "s", "buttons", "addChannel"])
              ),
              d.components.buildButton(
                "",
                d.i18n.t(["menu", "s", "buttons", "myChannels"])
              ),
            ],
            [
              d.components.buildButton(
                "",
                d.i18n.t(["menu", "s", "buttons", "help"])
              ),
              d.components.buildButton(
                localRouteNameMap.terms,
                d.i18n.t(["menu", "s", "buttons", "terms"])
              ),
            ],
            [
              d.components.buildButton(
                "",
                d.i18n.t(["menu", "s", "buttons", "payment"])
              ),
              d.components.buildButton(
                "",
                d.i18n.t(["menu", "s", "buttons", "settings"])
              ),
            ],
          ],
        },
      ];

      await d.render(messages);
    },

    terms: async (d: ControllerConstructedParams) => {
      const messages: MessageStructure[] = [
        {
          type: "text",
          text:
            "<blockquote expandable>" +
            d.i18n.t(["terms", "s", "message"]) +
            "</blockquote>",
          parseMode: "HTML",
          inlineMarkup: d.components.goBack.buildLayout(),
        },
      ] as const;

      await d.render(messages);
    },
  };
}
