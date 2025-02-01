import { type Routes, buildRoutes } from "yau";
import type { MakeServices } from "../service/services";
import { makeUserEntryRoutes } from "./user/userEntryControllers";
import { makeControlledChannelsRoutes } from "./controlledChannels/controlledChannelsController";
import { type G, type LR } from "./routeConsts";

type MakeRoutes = (p: { services: ReturnType<MakeServices> }) => Routes<G>;

export const makeRoutes = ({
  services,
}: Parameters<MakeRoutes>[0]): ReturnType<MakeRoutes> => {
  const entryRoutes = makeUserEntryRoutes();
  const controlledChannelRoutes = makeControlledChannelsRoutes({ services });

  const localRoutes: LR = {
    start: {
      method: entryRoutes.start,
      availableFrom: ["command"],
      routes: ["menu"],
    },
    menu: {
      method: entryRoutes.menu,
      availableFrom: ["command", "callback"],
      routes: ["terms", "addControlledChannel"],
    },
    terms: {
      method: entryRoutes.terms,
      availableFrom: ["command", "callback"],
    },

    addControlledChannel: {
      method: controlledChannelRoutes.addControlledChannel,
      availableFrom: ["command", "callback"],
      hasReplyKeyboard: true,
    },
  };
  return buildRoutes(localRoutes);
};
