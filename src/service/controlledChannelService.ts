import type { ProjectLogger } from "../lib/logger";
import type { MakeRepositories } from "../repository/_repositories";
import type { Consts } from "./_types";

export const makeControlledChannelService = function ({
  repositories,
  consts,
}: {
  repositories: ReturnType<MakeRepositories>;
  logger: ProjectLogger;
  consts: Consts;
}) {
  return {
    createChannel: async ({
      chatId,
      channelId,
    }: {
      chatId: number;
      channelId: number;
    }) => {
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
    },
  };
};

export type MakeControlledChannelService = typeof makeControlledChannelService;
