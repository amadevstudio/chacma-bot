import type { NextF } from "yau/src/controller/types";
import type {
  CustomMiddleware,
  MiddlewareConstructedParams,
} from "yau/src/core/types";
import type { MakeServices } from "../service/services";

type MakeRegisterUserMiddleware = (p: {
  services: ReturnType<MakeServices>;
}) => CustomMiddleware;

export const makeRegisterUserMiddleware =
  ({ services }: Parameters<MakeRegisterUserMiddleware>[0]): CustomMiddleware =>
  async (params: MiddlewareConstructedParams, next: NextF) => {
    const chatId = params.chat.id;
    if (chatId === undefined) {
      // TODO: log can't process
      return;
    }

    await services.userService.registerUser({
      chatId,
      languageCode: params.user.languageCode,
    });

    await next();
  };
