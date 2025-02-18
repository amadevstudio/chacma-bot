import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { type ExtractTablesWithRelations } from "drizzle-orm/relations";

import * as users from "./schema/usersSchema";
import * as controlledChannels from "./schema/controlledChannelsSchema";
import type { ProjectLogger } from "../lib/logger";

const schema = {
  ...users,
  ...controlledChannels,
};

const LOGGER_ENABLED = false;

export function createDbConnection({ logger }: { logger: ProjectLogger }) {
  logger.info("Initialing database connection");
  return drizzle(process.env.DATABASE_URL!, {
    schema,
    logger: LOGGER_ENABLED,
  });
}

// const db = drizzle(process.env.DATABASE_URL!, {
//   schema,
//   logger: LOGGER_ENABLED,
// });

export type Db = ReturnType<typeof createDbConnection>;

export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
