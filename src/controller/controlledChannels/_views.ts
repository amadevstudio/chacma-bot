import type {
  ControllerConstructedParams,
  FrameworkGenerics,
  MessageStructure,
} from "yau";
import type { makeControlledChannelService } from "../../service/controlledChannelService";
import { localActionByRouteNamesMap, localRouteNameMap } from "../_routeConsts";

export function buildChannelPageMessages<G extends FrameworkGenerics>(
  controlledChannel: Exclude<
    Awaited<
      ReturnType<
        ReturnType<typeof makeControlledChannelService>["dataForChannelPage"]
      >
    >,
    { error: string }
  >,
  d: ControllerConstructedParams<G>
) {
  const messages: MessageStructure[] = [
    {
      type: "text",
      text: controlledChannel.name ?? "",
      inlineMarkup: [
        [
          d.components.inlineButtons.buildState({
            type: "",
            text: d.i18n.t(["controlledChannel", "s", "addNewSource"]),
          }),
        ],
        [
          d.components.inlineButtons.buildState({
            type: "",
            text: d.i18n.t(["controlledChannel", "s", "showSources"]),
          }),
        ],
        [
          d.components.inlineButtons.buildAction({
            type: localRouteNameMap.controlledChannel,
            text: d.i18n.t([
              "controlledChannel",
              "s",
              "state",
              controlledChannel.isActive ? "active" : "inactive",
            ]),
            action: localActionByRouteNamesMap.controlledChat.changeActive,
          }),
        ],
        d.components.goBack.buildRow(),
      ],
    },
  ];
  return messages;
}
