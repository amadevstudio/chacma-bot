import type { ProjectLogger } from "../lib/logger";
import type { MakeServices } from "../service/_services";

export type ControllerParams = {
  services: ReturnType<MakeServices>;
  logger: ProjectLogger;
}
