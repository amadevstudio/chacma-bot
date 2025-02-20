import type { DbServiceParams } from "./_types";

export const makeControlledChannelService = function ({
  repositories,
  consts,
  logger,
}: DbServiceParams) {
  return {
    createChannel: async ({
      ownerChatId: chatId,
      channelId,
    }: {
      ownerChatId: number;
      channelId: number;
    }) => {
      try {
        // View user and self access
        const userData = await repositories.userRepository.findUser({
          serviceType: consts.serviceType,
          accountId: String(chatId),
        });

        // Create
        return repositories.controlledChannelRepository.createChannel({
          userId: userData.user.id,
          isOwner: true, // TODO
          controlledChannel: {
            accountId: String(channelId),
            name: "Name", // TODO
            isActive: true,
            allowAdministrator: true,
          },
          serviceType: consts.serviceType,
        });
      } catch (e) {
        logger.error(e);
        return { error: String(e) };
      }
    },
  };
};

export type MakeControlledChannelService = typeof makeControlledChannelService;
