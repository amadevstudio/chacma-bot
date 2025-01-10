import type { MessageStructure } from "yau/src/controller/types";
import type { ConstructedParams } from "yau/src/core/types";
import { localRouteNameMap } from "../routes";

type MenuData = {
  someData?: string;
};

export async function start(d: ConstructedParams) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: d.i18n.t(["start", "s", "message"]),
      inlineMarkup: [
        [
          d.components.buildButton(localRouteNameMap.menu, "Open menu", {
            someData: "Some data",
          } as MenuData),
        ],
        [
          d.components.buildButton(
            localRouteNameMap.deepMethod,
            "Or go deeper"
          ),
        ],
      ],
    },
  ] as const;

  return d.render(messages, { resending: d.isCommand });
}

export async function menu(d: ConstructedParams) {
  const data = d.unitedData as MenuData;

  const messages: MessageStructure[] = [
    {
      type: "text",
      text: data.someData ? "Hello there with " + data.someData : "Hello there",
      inlineMarkup: [
        [d.components.buildButton(localRouteNameMap.deepMethod, "Deeper")],
      ],
    },
    {
      type: "text",
      text: "And there",
      inlineMarkup: d.components.goBack.buildLayout(),
    },
  ] as const;
  return d.render(messages, { resending: d.isCommand });
}

export async function deepMethod(d: ConstructedParams) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: "Just goBack state",
      inlineMarkup: d.components.goBack.buildLayout(),
    },
  ] as const;
  return d.render(messages);
}
