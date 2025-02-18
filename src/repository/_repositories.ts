import type { ProjectLogger } from "../lib/logger";
import { makeRequester } from "../lib/requester";
import { makeControlledChannelRepository } from "./controlledChannelRepository";
import { makeUserRepository } from "./userRepository";
import type { Db } from "../db/drizzle";

export const makeRepositories = function ({
  baseUrl,
  logger,
  db,
}: {
  baseUrl: string;
  logger: ProjectLogger;
  db: Db;
}) {
  const requester = makeRequester({
    baseUrl: baseUrl,
    defaultHeaders: {
      "Content-Type": "application/json",
      // Authorization: "Bearer ACCESS_TOKEN",
    },
  });

  const repoParams = { requester, logger, db };

  return {
    userRepository: makeUserRepository(repoParams),
    controlledChannelRepository: makeControlledChannelRepository(repoParams),
  } as const;
};

export type MakeRepositories = typeof makeRepositories;
