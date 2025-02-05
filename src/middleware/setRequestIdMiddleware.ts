import type { MiddlewareConstructedParams, NextF } from "yau";
import type { CustomMiddleware } from "yau";
import RequestContext from "../lib/context/RequestContext";
import { generateUniqueId } from "../lib/random";

export const makeSetRequestIdMiddleware =
  (): CustomMiddleware =>
  async (_params: MiddlewareConstructedParams, next: NextF) => {
    RequestContext.run(async () => {
      RequestContext.set("botRequestId", generateUniqueId());
      await next();
    });
  };
