import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/_repositories";
import type { Consts } from "./_types";

function getCachedUser(
  chatId: number,
  logger: { warn: (...v: unknown[]) => void }
) {
  // TODO: move to repo and redis
  logger.warn(chatId, "TODO CACHED USER");
  return undefined;
}

export function makeUserService({
  repositories,
  logger,
  consts,
}: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
  consts: Consts;
}) {
  return {
    registerUser: async (params: { chatId: number; languageCode?: string }) => {
      const cachedUser = getCachedUser(params.chatId, logger);
      if (cachedUser !== undefined) {
        return;
      }

      const user = await repositories.userRepository.registerUser({
        chatId: params.chatId,
        languageCode: params.languageCode,
        serviceType: consts.serviceType,
      });

      // TODO: cache user

      return user;
    },
  } as const;
}

export type MakeUserService = typeof makeUserService;
