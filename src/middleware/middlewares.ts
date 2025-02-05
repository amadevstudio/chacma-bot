import type { CustomMiddleware } from "yau";
import { makeRegisterUserMiddleware } from "./registerUserMiddleware";
import type { MakeServices } from "../service/services";
import { makeSetRequestIdMiddleware } from "./setRequestIdMiddleware";
import type { ProjectLogger } from "../lib/logger";

type MakeMiddlewares = (p: {
  services: ReturnType<MakeServices>;
  logger: ProjectLogger;
}) => CustomMiddleware[];

export const makeMiddlewares = ({
  services,
  logger
}: Parameters<MakeMiddlewares>[0]): ReturnType<MakeMiddlewares> => {
  return [
    makeSetRequestIdMiddleware(),
    makeRegisterUserMiddleware({ services, logger }),
  ];
};
