import type { ProjectLogger } from "../lib/logger";
import { makeRequester } from "../lib/requester";
import { makeUserRepository, type MakeUserRepository } from "./userRepository";

export type MakeRepositories = (p: { baseUrl: string; logger: ProjectLogger }) => {
  userRepository: ReturnType<MakeUserRepository>;
};

export function makeRepositories({
  baseUrl,
  logger,
}: Parameters<MakeRepositories>[0]): ReturnType<MakeRepositories> {
  const requester = makeRequester({
    baseUrl: baseUrl,
    defaultHeaders: {
      "Content-Type": "application/json",
      // Authorization: "Bearer ACCESS_TOKEN",
    },
  });

  return {
    userRepository: makeUserRepository({ requester, logger }),
  } as const;
}

// export type Repositories = ReturnType<typeof makeRepositories>;
