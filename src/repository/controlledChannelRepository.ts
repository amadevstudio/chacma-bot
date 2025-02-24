import type { Db, Transaction } from "../db/drizzle";
import {
  controlledChannelServicesTable,
  controlledChannelsTable,
  usersToControlledChannelsTable,
} from "../db/schema/controlledChannelsSchema";
import type { ServiceParams } from "./_types";
import { eq, and } from "drizzle-orm";

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
  } as const;
};

export type MakeControlledChannelService =
  typeof makeControlledChannelRepository;
