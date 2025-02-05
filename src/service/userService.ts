import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/repositories";
import type { UserWithAccountsWithType } from "../types/entities";

export type MakeUserService = (p: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
}) => {
  registerUser: (p: {
    chatId: number;
    languageCode?: string;
  }) => Promise<UserWithAccountsWithType | undefined>;
};

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
}: Parameters<MakeUserService>[0]): ReturnType<MakeUserService> {
  return {
    registerUser: async (params) => {
      const cachedUser = getCachedUser(params.chatId, logger);
      if (cachedUser !== undefined) {
        return;
      }

      const user = await repositories.userRepository.registerUser({
        chatId: params.chatId,
        languageCode: params.languageCode,
      });

      // TODO: cache user

      return user;
    },
  } as const;
}
