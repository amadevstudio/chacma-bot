import type { Db } from "../db/drizzle";
import type { ProjectLogger } from "../lib/logger";
import type { Requester } from "../lib/requester";

export type ServiceParams = {
  requester: Requester;
  logger: ProjectLogger;
  db: Db;
};
