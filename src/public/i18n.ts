import type { Dictionary } from "yau";
import { addChannelCommands } from "../controller/_routes";

export type AvailableLanguages = "ru" | "en";

const navigation = {
  s: {
    goBack: {
      en: "<< Go back",
      ru: "<< Назад",
    },
  },
};

const paging = {
  n: {
    navigationHelper: {
      unite: {
        en: "Page {0} of {1}",
        ru: "Страница {0} из {1}",
      },
    },
  },
  s: {
    clearSearch: {
      en: "🆑 Clear search",
      ru: "🆑 Очистить поиск",
    },
  },
};

function makeStart(appName: string) {
  return {
    s: {
      message: {
        en: `Welcome to the ${appName}!

This bot allow you to automatically create posts on your channels using other.

By using the bot, you agree to the terms, which you can view using the /terms command`,
        ru: `Добро пожаловать в ${appName}!

Этот бот позволяет вам автоматически создавать посты на ваших каналах, использую другие.

Используя бота, вы соглашаетесь с правилами, которые можете прочитать по команде /terms`,
      },
      openMenu: {
        en: "Let's start!",
        ru: "Давайте начнём!",
      },
    },
  } as const;
}

function makeTerms(appName: string) {
  return {
    s: {
      message: {
        en: `Terms of Usage for ${appName}

1. Introduction

Welcome to the ${appName} (hereinafter referred to as "the Bot"). This Bot is designed to transfer rewritten posts from one web-channel (such as a Telegram channel) to the user's chat. By using the Bot, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use the Bot.

2. Description of Service

The Bot allows users to transfer posts from a specified web-channel to their chat. The Bot does not create, own, or control any of the content transferred. The user is solely responsible for ensuring that the use of the Bot complies with all applicable laws and regulations.

3. User Responsibilities

3.1. Compliance with Laws: The user is responsible for ensuring that the use of the Bot complies with all applicable laws, including but not limited to copyright laws, privacy laws, and terms of service of the web-channel from which the content is being transferred.

3.2. Content Ownership: The user acknowledges that they do not own the content being transferred and that the original creator retains all rights to the content.

3.3. Proper Use: The user agrees to use the Bot in a manner that is respectful and ethical. The user shall not use the Bot for any illegal, harmful, or malicious purposes.

4. Disclaimer of Liability

4.1. No Liability for Content: The author of the Bot disclaims any and all liability for the content transferred using the Bot. The user is solely responsible for the content they choose to transfer and any consequences that may arise from such transfer.

4.2. No Liability for Misuse: The author disclaims any and all liability for any misuse of the Bot by the user. The user is solely responsible for ensuring that their use of the Bot is legal and ethical.

4.3. No Liability for Technical Issues: The author disclaims any and all liability for any technical issues, errors, or malfunctions that may occur while using the Bot. The user agrees to use the Bot at their own risk.

5. Indemnification

The user agrees to indemnify and hold harmless the author of the Bot from and against any and all claims, damages, obligations, losses, liabilities, costs, debts, and expenses (including but not limited to attorney's fees) arising from:

5.1. The user's use of and access to the Bot.
5.2. The user's violation of any term of these Terms of Usage.
5.3. The user's violation of any third-party right, including without limitation any copyright, property, or privacy right.
5.4. Any claim that the user's use of the Bot caused damage to a third party.

6. Termination

The author reserves the right to terminate or suspend the user's access to the Bot at any time, without notice, for any reason, including without limitation if the user violates these Terms of Usage.

7. Governing Law

Any dispute arising out of or in connection with these Terms of Usage shall be finally settled by arbitration in accordance with the Rules of Arbitration of the International Chamber of Commerce ('ICC') by one or more arbitrators appointed in accordance with the said Rules. The seat of the arbitration shall be Moscow, Russia. The language of the arbitration shall be English.

8. Changes to Terms of Usage

The author reserves the right to modify or update these Terms of Usage at any time without prior notice. The user's continued use of the Bot after any modification to these Terms of Usage will constitute acceptance of such modification.

${/*9. Contact Information*/ ""}

${
  /*If you have any questions about these Terms of Usage, please contact [Your Contact Information].*/ ""
}

By using the Bot, you acknowledge that you have read, understood, and agreed to these Terms of Usage.`,
        ru: `Условия использования для ${appName}

1. введение

Добро пожаловать в ${appName} (далее именуемый "Бот"). Этот бот предназначен для транслирования переписанных сообщений с одного веб-канала (например, Telegram-канала) в чат пользователя. Используя бота, вы соглашаетесь соблюдать следующие положения и условия. Если вы не согласны с этими условиями, пожалуйста, не используйте Бота.

2. Описание сервиса

Бот позволяет пользователям передавать сообщения с указанного веб-канала в свой чат. Бот не создает, не владеет и не контролирует какой-либо передаваемый контент. Пользователь несет единоличную ответственность за то, чтобы использование Бота соответствовало всем применимым законам и положениям.

3. Обязанности пользователя

3.1. Соблюдение законов: Пользователь несет ответственность за обеспечение того, чтобы использование Бота соответствовало всем применимым законам, включая, но не ограничиваясь, законами об авторском праве, законами о конфиденциальности и условиями предоставления услуг веб-канала, с которого передается контент.

3.2. Право собственности на контент: Пользователь признает, что он не является владельцем передаваемого контента и что все права на контент принадлежат его создателю.

3.3. Надлежащее использование: Пользователь соглашается использовать Бота уважительным и этичным образом. Пользователь не должен использовать бота в каких-либо незаконных, вредоносных или злонамеренных целях.

4. Отказ от ответственности

4.1. Отсутствие ответственности за контент: Автор Бота отказывается от какой-либо ответственности за контент, передаваемый с помощью Бота. Пользователь несет единоличную ответственность за контент, который он выбирает для передачи, и за любые последствия, которые могут возникнуть в результате такой передачи.

4.2. Отсутствие ответственности за неправильное использование: Автор отказывается от какой-либо ответственности за любое неправильное использование Бота пользователем. Пользователь несет единоличную ответственность за то, чтобы его использование Бота было законным и этичным.

4.3. Отсутствие ответственности за технические проблемы: Автор не несет никакой ответственности за любые технические проблемы, ошибки или сбои в работе, которые могут возникнуть при использовании Бота. Пользователь соглашается использовать Бота на свой страх и риск.

5. Возмещение убытков

Пользователь соглашается возместить ущерб и обезопасить автора Бота от любых претензий, ущерба, обязательств, убытков, пассивов, издержек, долгов и издержек (включая, но не ограничиваясь, гонорарами адвокатов), возникающих в связи с:

5.1. Использование пользователем Бота и доступ к нему.
5.2. Нарушение пользователем любого пункта настоящих Условий использования.
5.3. Нарушение пользователем любых прав третьих лиц, включая, помимо прочего, любые авторские права, права собственности или права на неприкосновенность частной жизни.
5.4. Любые претензии о том, что использование пользователем бота нанесло ущерб третьей стороне.

6. Прекращение действия

Автор оставляет за собой право прекратить или приостановить доступ пользователя к Боту в любое время, без предварительного уведомления, по любой причине, в том числе, без ограничений, если пользователь нарушает настоящие Условия использования.

7. Применимое законодательство

Любой спор, возникающий из настоящих Условий использования или в связи с ними, подлежит окончательному разрешению в арбитраже в соответствии с Арбитражным регламентом Международной торговой палаты ("ICC") одним или несколькими арбитрами, назначенными в соответствии с указанными Правилами. Местом проведения арбитражного разбирательства является Москва, Россия. Языком арбитражного разбирательства является английский.

8. Изменения в Условиях использования

Автор оставляет за собой право изменять или обновлять настоящие Условия использования в любое время без предварительного уведомления. Продолжение использования пользователем Бота после внесения любых изменений в настоящие Условия использования будет означать принятие таких изменений.

${/*9. Контактная информация*/ ""}

${
  /*Если у вас есть какие-либо вопросы по поводу настоящих Условий использования, пожалуйста, свяжитесь с [Ваша контактная информация].*/ ""
}

Используя бота, вы подтверждаете, что прочитали, поняли и согласились с настоящими Условиями использования.`,
      },
    },
  } as const;
}

function makeMenu() {
  return {
    s: {
      fromStartMessage: {
        en: "You are in the bot's menu. Start exploring it using the buttons below",
        ru: "Вы в меню бота. Начните исследовать его с кнопок снизу",
      },
      message: {
        en: "Choose desired action",
        ru: "Выберите желаемое действие",
      },
      buttons: {
        addChannel: {
          en: "🆕 Add new channel",
          ru: "🆕 Добавить новый канал",
        },
        myChannels: {
          en: "👥 My channels",
          ru: "👥 Мои каналы",
        },
        help: {
          en: "ℹ️ Help",
          ru: "ℹ️ Помощь",
        },
        terms: {
          en: "📖 Terms of usage",
          ru: "📖 Правила использования",
        },
        payment: {
          en: "💵 Payment",
          ru: "💵 Оплата",
        },
        settings: {
          en: "⚙️ Settings",
          ru: "⚙️ Настройки",
        },
      },
    },
  };
}

function makeControlledChannelAdding() {
  return {
    s: {
      message: {
        en: `Channel adding

Forward the channel message or send the channel id (with minus)`,
        ru: `Добавление канала
Перешлите сообщение из канала или отправьте его id (с минусом)`,
      },
      belowMessage: {
        en: `Or push the button and select the channel`,
        ru: `Или нажмите кнопку и выберите канал`,
      },
      addChannel: {
        en: "Add channel",
        ru: "Добавить канал",
      },
      addedMessage: {
        en: "Channel with id {0} and name '{1}' added",
        ru: "Канал с id {0} и названием '{1}' добавлен",
      },
      errors: {
        chatNotFound: {
          en: "The specified chat was not found. The bot should be added as a channel admin and should not be blocked.",
          ru: "Указанный чат не найден. Бот должен быть добавлен в качестве администратора канала и не должен быть заблокирован.",
        },
        botCantPostMessages: {
          en: "The bot does not have permission to post messages in the channel.",
          ru: "У бота нет разрешения на публикацию сообщений в канале.",
        },
        notAdmin: {
          en: "The adding administrator must be an administrator of the channel with the right to send messages or creator of the channel.",
          ru: "Добавляющий администратор должен быть администратором канала с правом отправки сообщений или создателем канала.",
        },
        onlyOwnerCanAdd: {
          en: "Only the owner of the channel can add it to the list of controlled channels.",
          ru: "Только владелец канала может добавить его в список управляемых каналов.",
        },
        whileSaving: {
          en: "An error occurred while saving the channel.",
          ru: "Произошла ошибка при сохранении канала.",
        },
        genericError: {
          en: "An error occurred while retrieving the channel information.",
          ru: "Произошла ошибка при получении информации о канале.",
        },
      },
    },
  } as const;
}

function makeControlledChannelList() {
  return {
    s: {
      errors: {
        gettingChannels: {
          en: "An error occurred while retrieving the list of channels.",
          ru: "Произошла ошибка при получении списка каналов.",
        },
        noDataFound: {
          en:
            "You haven't added any channels yet. Use /" +
            addChannelCommands[0] +
            " to add a channel.",
          ru:
            "Вы ещё не добавили ни одного канала. Используйте /" +
            addChannelCommands[0] +
            " для добавления канала.",
        },
        noDataFoundInSearch: {
          en: "No channels found for the specified query.",
          ru: "По указанному запросу ничего не найдено.",
        },
        genericError: {
          en: "An error occurred while retrieving the list of channels.",
          ru: "Произошла ошибка при получении списка каналов.",
        },
      },
    },
  } as const;
}

const controlledChannel = {
  s: {
    errors: {
      general: {
        en: "An error occurred while retrieving the channel information.",
        ru: "Произошла ошибка при получении информации о канале.",
      },
      channelNotFound: {
        en: "Channel not found.",
        ru: "Канал не найден.",
      },
    },
    addNewSource: {
      en: "Add new source",
      ru: "Добавить новый источник",
    },
    showSources: {
      en: "Show sources",
      ru: "Показать источники",
    },
    state: {
      active: {
        en: "Active",
        ru: "Активен",
      },
      activated: {
        en: "Channel activated",
        ru: "Канал активирован",
      },
      inactive: {
        en: "Inactive",
        ru: "Неактивен",
      },
      deactivated: {
        en: "Channel deactivated",
        ru: "Канал деактивирован",
      },
    },
  },
};

export default function configureI18n({
  appName,
}: {
  appName: string;
}): Dictionary<AvailableLanguages> {
  return {
    navigation,
    paging,

    start: makeStart(appName),

    terms: makeTerms(appName),

    menu: makeMenu(),

    controlledChannelAdding: makeControlledChannelAdding(),
    controlledChannelList: makeControlledChannelList(),
    controlledChannel,
  } as const;
}
