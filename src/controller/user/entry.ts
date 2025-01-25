import type { MessageStructure } from "yau/src/controller/types";
import type { ConstructedParams } from "yau/src/core/types";
import { localRouteNameMap } from "../routes";

type MenuData = {
  fromStart?: boolean;
};

export async function start(d: ConstructedParams) {
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
}

export async function menu(d: ConstructedParams) {
  d.services.userStateService.clearUserStorage(); // New beginning

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
            "",
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
}

export async function terms(d: ConstructedParams) {
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
}
