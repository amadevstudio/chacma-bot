import {
  type ControllerConstructedParams,
  type LocalRoutes,
  buildEntityNamesMap,
  buildRoutesList,
} from "yau";
import type { AvailableLanguages } from "../public/i18n";

// Routes
export const localRouteNames = [
  "start",
  "menu",
  "terms",
  "addControlledChannel",
] as const;
type LocalRouteNames = (typeof localRouteNames)[number];

// Map to use in controllers
export const localRouteNameMap = buildEntityNamesMap(localRouteNames);
// Array to build types
const availableRoutes = buildRoutesList(localRouteNames);
console.log(availableRoutes);
export type AvailableRoutes = (typeof availableRoutes)[number];

// Actions
// TODO
type LocalActionNames = string;
type AvailableActions = LocalActionNames;

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
