import type { ConstructedParams } from "yau/src/core/types";

export default async function start(d: ConstructedParams) {
  await d.outerSender(d.chat.id, [
    {
      type: "text",
      text: d.i18n.t(["start", "s", "message"])
    }
  ]);
}
