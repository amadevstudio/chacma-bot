import { type Routes, buildRoutes } from "yau";
import type { MakeServices } from "../service/services";
import { makeUserEntryRoutes } from "./user/userEntryControllers";
import { makeControlledChannelsRoutes } from "./controlledChannels/controlledChannelsController";
import { type G, type LR } from "./routeConsts";
import type { ProjectLogger } from "../lib/logger";

type MakeRoutes = (p: {
  services: ReturnType<MakeServices>;
  logger: ProjectLogger;
}) => Routes<G>;

export const makeRoutes = ({
  services,
  logger,
}: Parameters<MakeRoutes>[0]): ReturnType<MakeRoutes> => {
  const entryRoutes = makeUserEntryRoutes();
  const controlledChannelRoutes = makeControlledChannelsRoutes({
    services,
    logger,
  });

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
      availableFrom: ["command", "callback", "message"],
      commands: ["addChannel"],
      hasReplyKeyboard: true,
      waitsForInput: true,
    },
  };
  return buildRoutes(localRoutes);
};
