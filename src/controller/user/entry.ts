import type { MessageStructure } from "yau/src/controller/types";
import type { ConstructedParams } from "yau/src/core/types";
import { localRouteNameMap } from "../routes";

export async function start(d: ConstructedParams) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: d.i18n.t(["start", "s", "message"]),
      inlineMarkup: [
        [
          {
            text: "Open menu",
            asd: "kek",
            data: { $tp: localRouteNameMap.menu },
          },
        ],
        [d.components.buildButton(localRouteNameMap.menu, "Open menu")],
        // [
        //   d.components.buildButton(
        //     localRouteNameMap.deepMethod,
        //     "Or go deeper"
        //   ),
        // ],
      ],
    },
  ];

  return d.render(messages, { resending: d.isCommand });
}

export async function menu(d: ConstructedParams) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: "Hello there",
      inlineMarkup: [
        [d.components.buildButton(localRouteNameMap.deepMethod, "Deeper")],
      ],
    },
    {
      type: "text",
      text: "And there",
      inlineMarkup: d.components.goBack.buildLayout(),
    },
  ];
  return d.render(messages, { resending: d.isCommand });
}

export async function deepMethod(d: ConstructedParams) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: "Just goBack state",
      inlineMarkup: d.components.goBack.buildLayout(),
    },
  ];
  return d.render(messages);
}
