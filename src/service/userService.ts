import type { MakeRepositories } from "../repository/repositories";
import type { UserWithAccountsWithType } from "../types/entities";

export type MakeUserService = (p: {
  repositories: ReturnType<MakeRepositories>;
}) => {
  registerUser: (p: {
    chatId: number;
    languageCode?: string;
  }) => Promise<UserWithAccountsWithType | undefined>;
};

function getCachedUser(chatId: number) {
  // TODO: go to repo and redis
  console.log(chatId, "TODO CACHED USER");
  return undefined;
}

export function makeUserService({
  repositories,
}: Parameters<MakeUserService>[0]): ReturnType<MakeUserService> {
  return {
    registerUser: async (params) => {
      const cachedUser = getCachedUser(params.chatId);
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
