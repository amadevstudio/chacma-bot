import type { NextF } from "yau/src/controller/types";
import type {
  CustomMiddleware,
  MiddlewareConstructedParams,
} from "yau/src/core/types";

export const registerUser: CustomMiddleware = async (
  params: MiddlewareConstructedParams,
  next: NextF
) => {
  console.log("BEFORE", params);
  await next();
  console.log("AFTER", params);
};
