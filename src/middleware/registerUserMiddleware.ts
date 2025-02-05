import type { NextF, CustomMiddleware, MiddlewareConstructedParams } from "yau";
import type { MakeServices } from "../service/services";
import type { ProjectLogger } from "../lib/logger";

type MakeRegisterUserMiddleware = (p: {
  services: ReturnType<MakeServices>;
  logger: ProjectLogger;
}) => CustomMiddleware;

export const makeRegisterUserMiddleware =
  ({
    services,
    logger,
  }: Parameters<MakeRegisterUserMiddleware>[0]): CustomMiddleware =>
  async (params: MiddlewareConstructedParams, next: NextF) => {
    const chatId = params.chat.id;
    if (chatId === undefined) {
      // TODO: write to user can't process
      logger.warn("Can't register user: chatId is undefined", params);
      return;
    }

    await services.userService.registerUser({
      chatId,
      languageCode: params.user.languageCode,
    });

    await next();
  };
