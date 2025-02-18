import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  varchar,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers';

// Users
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  ...timestamps,
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToAccounts: many(usersToAccountsTable),
}));

// Users to accounts
export const usersToAccountsTable = pgTable(
  'users_to_accounts',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id),
    serviceId: integer('service_id')
      .notNull()
      .references(() => userAccountServicesTable.id),
    accountId: varchar('account_id', { length: 256 }).notNull().unique(), // inside the service
    languageCode: varchar('language_code', { length: 8 }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.accountId] }),
    uniqueIndex().on(table.serviceId, table.accountId),
  ],
);

export const usersToAccountsRelations = relations(
  usersToAccountsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToAccountsTable.userId],
      references: [usersTable.id],
    }),
    service: one(userAccountServicesTable, {
      fields: [usersToAccountsTable.serviceId],
      references: [userAccountServicesTable.id],
    }),
  }),
);

// User services
export const userAccountServicesTable = pgTable('user_account_services', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull().unique(),
  ...timestamps,
});

export const userAccountServicesRelations = relations(
  userAccountServicesTable,
  ({ many }) => ({
    usersToAccounts: many(usersToAccountsTable),
  }),
);
