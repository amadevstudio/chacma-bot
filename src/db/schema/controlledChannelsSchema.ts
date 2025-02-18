import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  varchar,
  primaryKey,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers';
import { usersToAccountsTable, usersTable } from './usersSchema';

// Controlled Channels
export const controlledChannelsTable = pgTable(
  'controlled_channels',
  {
    id: serial('id').primaryKey(),
    serviceId: integer()
      .notNull()
      .references(() => controlledChannelServicesTable.id),
    accountId: varchar('account_id', { length: 256 }).notNull().unique(), // inside the service
    name: varchar('name', { length: 255 }),
    isActive: boolean('is_active').notNull().default(true),
    allowAdministrators: boolean('allow_administrators')
      .notNull()
      .default(false),
    ...timestamps,
  },
  (t) => [uniqueIndex().on(t.accountId, t.serviceId)],
);

export const controlledChannelsRelations = relations(
  controlledChannelsTable,
  ({ one, many }) => ({
    service: one(controlledChannelServicesTable, {
      fields: [controlledChannelsTable.serviceId],
      references: [controlledChannelServicesTable.id],
    }),
    userToControlledChannels: many(usersToAccountsTable),
  }),
);

// Controlled Channels services
export const controlledChannelServicesTable = pgTable(
  'controlled_channel_services',
  {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 50 }).notNull().unique(),
    ...timestamps,
  },
);

export const controlledChannelServicesRelations = relations(
  controlledChannelServicesTable,
  ({ many }) => ({
    controlledChannels: many(controlledChannelsTable),
  }),
);

// Users to controlled channels
export const usersToControlledChannelsTable = pgTable(
  'users_to_controlled_channels',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id),
    controlledChannelId: integer('controlled_channel_id')
      .notNull()
      .references(() => controlledChannelsTable.id),
    isOwner: boolean('is_owner').notNull(),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.controlledChannelId] })],
);

export const usersToControlledChannelsRelations = relations(
  usersToControlledChannelsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToControlledChannelsTable.userId],
      references: [usersTable.id],
    }),
    channel: one(controlledChannelsTable, {
      fields: [usersToControlledChannelsTable.controlledChannelId],
      references: [controlledChannelsTable.id],
    }),
  }),
);
