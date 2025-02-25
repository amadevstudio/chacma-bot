import type { Db, Transaction } from "../db/drizzle";
import {
  controlledChannelServicesTable,
  controlledChannelsTable,
  usersToControlledChannelsTable,
} from "../db/schema/controlledChannelsSchema";
import {
  userAccountServicesTable,
  usersToAccountsTable,
} from "../db/schema/usersSchema";
import type { ServiceParams } from "./_types";
import { eq, and, ilike, asc, count } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

async function getChannelInfo(
  db: Db | Transaction,
  accountId: string,
  serviceType: string,
  channelId?: number
) {
  const results = await db
    .select({ channel: controlledChannelsTable })
    .from(controlledChannelsTable)
    .innerJoin(
      controlledChannelServicesTable,
      eq(controlledChannelsTable.serviceId, controlledChannelServicesTable.id)
    )
    .where(
      and(
        channelId !== undefined
          ? eq(controlledChannelsTable.id, channelId)
          : undefined,
        eq(controlledChannelsTable.accountId, accountId),
        eq(controlledChannelServicesTable.type, serviceType)
      )
    );
  return results.length > 0 ? results[0].channel : null;
}

function channelListQuery<T extends PgSelect>(
  qb: T,
  serviceType: string,
  userId: string,
  searchQuery?: string
) {
  return qb
    .innerJoin(
      usersToControlledChannelsTable,
      eq(
        usersToControlledChannelsTable.controlledChannelId,
        controlledChannelsTable.id
      )
    )
    .innerJoin(
      usersToAccountsTable,
      eq(usersToAccountsTable.userId, usersToControlledChannelsTable.userId)
    )
    .innerJoin(
      userAccountServicesTable,
      and(
        eq(userAccountServicesTable.type, serviceType),
        eq(userAccountServicesTable.id, usersToAccountsTable.serviceId)
      )
    )
    .where(
      and(
        eq(usersToAccountsTable.accountId, userId),
        searchQuery
          ? ilike(controlledChannelsTable.name, `%${searchQuery}%`)
          : undefined
      )
    );
}

export const makeControlledChannelRepository = function ({
  db,
}: ServiceParams) {
  return {
    findByServiceId: async ({
      serviceId,
      serviceType,
    }: {
      serviceId: string;
      serviceType: string;
    }) => {
      return getChannelInfo(db, serviceId, serviceType);
    },

    create: async ({
      userId,
      isOwner,
      controlledChannel,
      serviceType,
    }: {
      userId: number;
      isOwner: boolean;
      controlledChannel: {
        accountId: string;
        name: string;
        isActive: boolean;
        allowAdministrators: boolean;
      };
      serviceType: string;
    }) => {
      const channelInfo = await getChannelInfo(
        db,
        controlledChannel.accountId,
        serviceType
      );

      // Return if exists
      if (channelInfo !== null) {
        return channelInfo;
      }

      // Register
      return db.transaction(async (tx) => {
        // Validate service type
        const accountService =
          await tx.query.controlledChannelServicesTable.findFirst({
            where: (t, { eq }) => eq(t.type, serviceType),
          });
        if (accountService === undefined) return { error: "typeNotFound" };

        // Create channel
        const newChannelId = (
          await tx
            .insert(controlledChannelsTable)
            .values({
              serviceId: accountService.id,
              ...controlledChannel,
            })
            .returning({ id: controlledChannelsTable.id })
        )[0].id;
        // Connect to user
        await tx.insert(usersToControlledChannelsTable).values({
          userId,
          isOwner,
          controlledChannelId: newChannelId,
        });

        return await getChannelInfo(
          tx,
          controlledChannel.accountId,
          serviceType,
          newChannelId
        );
      });
    },

    listForUser: async (
      serviceType: string,
      userId: string,
      {
        offset,
        perPage,
        searchQuery,
      }: { offset: number; perPage: number; searchQuery?: string }
    ) => {
      const result = channelListQuery(
        db
          .select({ channel: controlledChannelsTable })
          .from(controlledChannelsTable)
          .$dynamic(),
        serviceType,
        userId,
        searchQuery
      );
      return (
        await result
          .limit(perPage)
          .offset(offset)
          .orderBy(asc(controlledChannelsTable.name))
      ).map((ch) => ch.channel);
    },

    countForUser: async (
      serviceType: string,
      userId: string,
      { searchQuery }: { searchQuery?: string }
    ) => {
      const result = await channelListQuery(
        db.select({ count: count() }).from(controlledChannelsTable).$dynamic(),
        serviceType,
        userId,
        searchQuery
      );

      // Ensure the count is returned as a number
      return result.length > 0 ? Number(result[0].count) : 0;
    },
  } as const;
};

export type MakeControlledChannelService =
  typeof makeControlledChannelRepository;
