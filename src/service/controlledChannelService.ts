import type { DbServiceParams } from "./_types";

export const makeControlledChannelService = function ({
  repositories,
  consts,
  logger,
}: DbServiceParams) {
  return {
    create: async ({
      ownerChatId,
      channelId,
      isOwner,
      channelName,
    }: {
      ownerChatId: number;
      channelId: number;
      isOwner: boolean;
      channelName: string;
    }) => {
      try {
        // View user and self access
        const userData = await repositories.userRepository.findUser({
          serviceType: consts.serviceType,
          accountId: String(ownerChatId),
        });

        // Create
        const creationResult =
          await repositories.controlledChannelRepository.create({
            userId: userData.user.id,
            isOwner: isOwner,
            controlledChannel: {
              accountId: String(channelId),
              name: channelName,
              isActive: true,
              allowAdministrators: true,
            },
            serviceType: consts.serviceType,
          });

        if (creationResult === null) {
          return { error: "Cannot create channel" };
        } else {
          return { channel: creationResult };
        }
      } catch (e) {
        logger.error(e);
        return { error: String(e) };
      }
    },
  };
};

export type MakeControlledChannelService = typeof makeControlledChannelService;
