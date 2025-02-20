import type { TeleBot } from "yau";
import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/_repositories";

export type Consts = {
  serviceType: "telegram";
};

export type DbServiceParams = {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
  consts: Consts;
};

export type TgServiceParams = {
  logger: ProjectLogger;
  bot: TeleBot;
}
