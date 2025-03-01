import type { ControllerConstructedParams, FrameworkGenerics } from "yau";

export function renderErrorMessage(
  d: ControllerConstructedParams<FrameworkGenerics>,
  textKey: string[]
) {
  return d.render(
    d.components.emptyStateMessage({
      text: d.i18n.t(textKey),
    })
  );
}
