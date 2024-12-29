import type { Routes } from "yau/src/core/types";
import start from "./user/start";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const availableRoutes = ["start"] as const;

export type AvailableRoutes = (typeof availableRoutes)[number];

export const routes: Routes<AvailableRoutes> = {
  start: {
    method: start,
    availableFrom: ["command"],
    routes: ["start"],
  },
};
