import type { CustomMiddleware } from "yau";
import { makeRegisterUserMiddleware } from "./registerUserMiddleware";
import type { MakeServices } from "../service/services";

type MakeMiddlewares = (p: {
  services: ReturnType<MakeServices>;
}) => CustomMiddleware[];

export const makeMiddlewares = ({
  services,
}: Parameters<MakeMiddlewares>[0]): ReturnType<MakeMiddlewares> => {
  return [makeRegisterUserMiddleware({ services })];
};
