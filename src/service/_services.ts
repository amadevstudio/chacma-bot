import type { TeleBot } from "yau";
import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/_repositories";
import type { Consts } from "./_types";
import { makeControlledChannelService } from "./controlledChannelService";
import { makeUserService } from "./userService";
import { makeTelegramChannelService } from "./telegramChannelService";

export function makeServices({
  repositories,
  logger,
  bot
}: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
  bot: TeleBot;
}) {
  const dbServiceParams = {
    repositories,
    logger,
    consts: {
      serviceType: "telegram",
    } as Consts,
  };

  const tgServiceParams = {
    repositories,
    logger,
    consts: {
      serviceType: "telegram",
    } as Consts,
    bot
  }

  return {
    userService: makeUserService(dbServiceParams),
    controlledChannelService: makeControlledChannelService(dbServiceParams),
    telegramChannelService: makeTelegramChannelService(tgServiceParams),
  } as const;
}

export type MakeServices = typeof makeServices;
