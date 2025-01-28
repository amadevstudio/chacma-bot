import type { MakeRepositories } from "../repository/repositories";
import { makeUserService, type MakeUserService } from "./userService";

export type MakeServices = (p: {
  repositories: ReturnType<MakeRepositories>;
}) => {
  userService: ReturnType<MakeUserService>;
};

export function makeServices({
  repositories,
}: Parameters<MakeServices>[0]): ReturnType<MakeServices> {
  return {
    userService: makeUserService({ repositories }),
  } as const;
}
