import type { Db, Transaction } from "../db/drizzle";
import {
  userAccountServicesTable,
  usersTable,
  usersToAccountsTable,
} from "../db/schema/usersSchema";
import type { ServiceParams } from "./_types";
import { eq, and } from "drizzle-orm";

function findUser(op: Db | Transaction, userId: number) {
  return op.query.usersTable.findFirst({
    ...(userId
      ? { where: (usersTable, { eq }) => eq(usersTable.id, userId) }
      : {}),
    with: {
      usersToAccounts: {
        with: {
          service: true,
        },
      },
    },
  });
}

async function getUserInfo(
  op: Db | Transaction,
  accountId: string,
  serviceType: string,
  userId?: number
) {
  return (
    await op
      .select({
        user: usersTable,
        account: usersToAccountsTable,
        accountType: userAccountServicesTable,
      })
      .from(usersTable)
      .innerJoin(
        usersToAccountsTable,
        eq(usersTable.id, usersToAccountsTable.userId)
      )
      .innerJoin(
        userAccountServicesTable,
        eq(usersToAccountsTable.serviceId, userAccountServicesTable.id)
      )
      .where(
        and(
          userId !== undefined ? eq(usersTable.id, userId) : undefined, // Filter by user ID (if provided)
          eq(usersToAccountsTable.accountId, accountId),
          eq(userAccountServicesTable.type, serviceType)
        )
      )
      .execute()
  )[0];
}

export const makeUserRepository = function ({ db }: ServiceParams) {
  const repo = {
    registerUser: async ({
      serviceType,
      chatId,
      languageCode,
    }: {
      serviceType: string;
      chatId: number;
      languageCode?: string;
    }) => {
      const accountId = String(chatId);

      // Ensure doesn't exist
      const userInfo = await getUserInfo(db, accountId, serviceType);

      // Already exists
      if (userInfo) {
        // Update language code
        if (
          languageCode !== undefined &&
          languageCode !== userInfo.account.languageCode
        ) {
          await db
            .update(usersToAccountsTable)
            .set({ languageCode: languageCode })
            .where(eq(usersToAccountsTable.userId, userInfo.user.id));
        }
        // And return
        return {
          user: await findUser(db, userInfo.user.id),
          isNew: false,
        };
      }

      // Register
      return db.transaction(async (tx) => {
        // Validate account type
        const accountService =
          await tx.query.userAccountServicesTable.findFirst({
            where: (t, { eq }) => eq(t.type, serviceType),
          });
        if (accountService === undefined) return { error: "typeNotFound" };

        // Create user
        const newUserId = (
          await tx
            .insert(usersTable)
            .values({})
            .returning({ id: usersTable.id })
        )[0].id;
        await tx.insert(usersToAccountsTable).values({
          userId: newUserId,
          serviceId: accountService.id,
          accountId: accountId,
          languageCode: languageCode,
        });

        // Return
        return {
          user: await findUser(tx, newUserId),
          isNew: false,
        };
      });
    },

    findUser: async (params: { serviceType: string; accountId: string }) => {
      return await getUserInfo(db, params.accountId, params.serviceType);
    },
  } as const;

  return repo;
};

export type MakeUserRepository = typeof makeUserRepository;
