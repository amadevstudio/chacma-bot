import {
  type ControllerConstructedParams,
  type LocalRoutes,
  buildEntityNamesMap,
  buildRoutesList,
  buildActionsList,
} from "yau";
import type { AvailableLanguages } from "../public/i18n";

// Routes
const localRouteNames = [
  "start",
  "menu",
  "terms",
  "addControlledChannel",
  "listControlledChannels",
  "controlledChannel",
] as const;
// Type of all project routes
type LocalRouteNames = (typeof localRouteNames)[number];
// Map to use in controllers
export const localRouteNameMap = buildEntityNamesMap(localRouteNames) as {
  [key in LocalRouteNames]: key;
};
// Array to build types
const availableRoutes = buildRoutesList(localRouteNames);
console.log("Routes:", availableRoutes);
export type AvailableRoutes = (typeof availableRoutes)[number];

// Actions
const localActionByRouteNames = {
  controlledChat: ["changeActive"],
} as const;
export const localActionNames = Object.values(localActionByRouteNames).flat();
// Type of all project actions
type LocalActionNames = (typeof localActionNames)[number];
// Map to use in controllers
export const localActionByRouteNamesMap = Object.fromEntries(
  Object.entries(localActionByRouteNames).map(([route, actions]) => [
    route,
    buildEntityNamesMap(actions),
  ])
) as {
  [K in keyof typeof localActionByRouteNames]: {
    [key in (typeof localActionByRouteNames)[K][number]]: key;
  };
};
// Array to build framework types
const availableActions = buildActionsList(localActionNames);
console.log("Actions:", availableActions);
export type AvailableActions = (typeof availableActions)[number];

// Framework generics for
export type G = {
  AR: AvailableRoutes;
  AA: AvailableActions;
  AL: AvailableLanguages;
};

export type D = ControllerConstructedParams<G>;

export type LR = LocalRoutes<{
  AR: LocalRouteNames;
  AA: LocalActionNames;
  AL: G["AL"];
}>;
