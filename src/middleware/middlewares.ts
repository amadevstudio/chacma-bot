import type { CustomMiddleware } from "yau/src/core/types";
import { registerUser } from "./registerUser";

export const middlewares: CustomMiddleware[] = [registerUser];
