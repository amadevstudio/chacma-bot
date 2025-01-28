import type { Routes, LocalRoutes } from "yau/src/core/types";
import {
  buildRoutesList,
  buildRoutes,
  buildEntityNamesMap,
} from "yau/src/controller/defaultRoutes";
import type { MakeServices } from "../service/services";
import { makeEntryRoutes } from "./user/entry";

const localRouteNames = ["start", "menu", "terms"] as const;

type LocalRouteNames = (typeof localRouteNames)[number];

// TODO
type LocalActionNames = string;
export type AvailableActions = LocalActionNames;

export const localRouteNameMap = buildEntityNamesMap(localRouteNames);
const availableRoutes = buildRoutesList(localRouteNames);

console.log(availableRoutes);

export type AvailableRoutes = (typeof availableRoutes)[number];

// const routes: Routes<AvailableRoutes> = buildRoutes(localRoutes);

type MakeRoutes = (p: {
  services: ReturnType<MakeServices>;
}) => Routes<AvailableRoutes>;

export const makeRoutes = ({
  services,
}: Parameters<MakeRoutes>[0]): ReturnType<MakeRoutes> => {
  // TODO: remove
  console.log(services);

  const entryRoutes = makeEntryRoutes();

  const localRoutes: LocalRoutes<LocalRouteNames, LocalActionNames> = {
    start: {
      method: entryRoutes.start,
      availableFrom: ["command"],
      routes: ["menu"],
    },
    menu: {
      method: entryRoutes.menu,
      availableFrom: ["command", "callback"],
    },
    terms: {
      method: entryRoutes.terms,
      availableFrom: ["command", "callback"],
    },
  };
  return buildRoutes(localRoutes);
};
