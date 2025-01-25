import type { Routes, LocalRoutes } from "yau/src/core/types";
import { start, menu, terms } from "./user/entry";
import {
  buildRoutesList,
  buildRoutes,
  buildEntityNamesMap,
} from "yau/src/controller/defaultRoutes";

type LocalRouteNames = "start" | "menu" | "terms";
type LocalActionNames = string;

const localRoutes: LocalRoutes<LocalRouteNames, LocalActionNames> = {
  start: {
    method: start,
    availableFrom: ["command"],
    routes: ["menu"],
  },
  menu: {
    method: menu,
    availableFrom: ["command", "callback"],
  },
  terms: {
    method: terms,
    availableFrom: ["command", "callback"]
  }
};

export const localRouteNameMap = buildEntityNamesMap(localRoutes);

const availableRoutes = buildRoutesList<LocalRouteNames>(
  Object.keys(localRoutes) as LocalRouteNames[]
);

console.log(availableRoutes);

export type AvailableRoutes = (typeof availableRoutes)[number];

export const routes: Routes<AvailableRoutes> = buildRoutes(localRoutes);

export type AvailableActions = LocalActionNames;
