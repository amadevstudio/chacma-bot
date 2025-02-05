import { Logger } from "tslog";
import RequestContext from "./context/RequestContext";

export class ProjectLogger {
  private logger: Logger<unknown>;

  constructor() {
    this.logger = new Logger<unknown>({});
  }

  #getRandomId(): string {
    return RequestContext.get("botRequestId") || "unknown";
  }

  info(...args: unknown[]): void {
    this.logger.info(`[${this.#getRandomId()}]`, ...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(`[${this.#getRandomId()}]`, ...args);
  }

  error(...args: unknown[]): void {
    try {
      this.logger.error(`[${this.#getRandomId()}]`, ...args);
    } catch {
      this.logger.error(
        `[${this.#getRandomId()}]`,
        ...args.map((a) => (a instanceof Error ? new Error(String(a)) : a))
      );
    }
  }

  debug(...args: unknown[]): void {
    this.logger.debug(`[${this.#getRandomId()}]`, ...args);
  }
}

export default function initializeLogger(): ProjectLogger {
  return new ProjectLogger();
}
