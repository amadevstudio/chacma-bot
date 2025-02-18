import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/db/schema/controlledChannelsSchema';
import { userAccountServicesTable } from '../src/db/schema/usersSchema';
import { controlledChannelServicesTable } from '../src/db/schema/controlledChannelsSchema';

async function main() {
  try {
    const db = drizzle(process.env.DATABASE_URL!, { schema });
    // await seed(db, {  })
    await db
      .insert(userAccountServicesTable)
      .values({ type: 'telegram' })
      .onConflictDoNothing();
    await db
      .insert(controlledChannelServicesTable)
      .values({ type: 'telegram' })
      .onConflictDoNothing();
  } finally {
    // process.exit();
  }
}

void main();
