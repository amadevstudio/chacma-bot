import type { ProjectLogger } from "../lib/logger";
import type { Requester } from "../lib/requester";
import type { UserWithAccountsWithType } from "../types/entities";

type RegisterUserBody = {
  accountType: "telegram";
  accountId: string;
  languageCode?: string;
};

export type MakeUserRepository = (p: {
  requester: Requester;
  logger: ProjectLogger;
}) => {
  registerUser: (p: {
    chatId: number;
    languageCode?: string;
  }) => Promise<UserWithAccountsWithType>;
};

export function makeUserRepository({
  requester,
}: Parameters<MakeUserRepository>[0]): ReturnType<MakeUserRepository> {
  return {
    registerUser: async (
      {
        chatId,
        languageCode,
      } /*: Parameters<ReturnType<MakeUserRepository>["registerUser"]>[0]*/
    ) => {
      const body: RegisterUserBody = {
        accountType: "telegram",
        accountId: String(chatId),
        languageCode: languageCode,
      };
      return await requester<UserWithAccountsWithType>(`/user`, {
        method: "POST",
        body,
      });
    },
  } as const;
}
