import type { TeleBot } from "yau";
import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/_repositories";
import type { Consts } from "./_types";
import { makeControlledChannelService } from "./controlledChannelService";
import { makeUserService } from "./userService";

export function makeServices({
  repositories,
  logger,
}: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
  bot: TeleBot;
}) {
  const serviceParams = {
    repositories,
    logger,
    consts: {
      serviceType: "telegram",
    } as Consts,
  };

  return {
    userService: makeUserService(serviceParams),
    controlledChannelService: makeControlledChannelService(serviceParams),
  } as const;
}

export type MakeServices = typeof makeServices;
