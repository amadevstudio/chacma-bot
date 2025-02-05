import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/repositories";
import { makeUserService, type MakeUserService } from "./userService";

export type MakeServices = (p: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
}) => {
  userService: ReturnType<MakeUserService>;
};

export function makeServices({
  repositories,
  logger,
}: Parameters<MakeServices>[0]): ReturnType<MakeServices> {
  return {
    userService: makeUserService({ repositories, logger }),
  } as const;
}
