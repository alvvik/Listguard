import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../../config";

const PAGE_SIZE = 5;

const createPageRow = (currentPage: number, totalPages: number) => {
  const previousButton = new ButtonBuilder()
    .setCustomId(`applications:prev:${currentPage}`)
    .setLabel("Wstecz")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage === 0);

  const nextButton = new ButtonBuilder()
    .setCustomId(`applications:next:${currentPage}`)
    .setLabel("Dalej")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage >= totalPages - 1);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    previousButton,
    nextButton,
  );
};

const createApplicationsEmbed = (
  interaction: ChatInputCommandInteraction,
  applications: Array<{
    id: number;
    status: string;
    createdAt: string;
    discordId: string | null;
    username: string | null;
  }>,
  page: number,
) => {
  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const visibleApplications = applications.slice(start, start + PAGE_SIZE);

  const description = visibleApplications
    .map((application, index) => {
      const createdAt = new Date(application.createdAt).toLocaleString("pl-PL");
      const position = start + index + 1;
      const statusLabel =
        config.applicationStatusLabel[
          application.status as keyof typeof config.applicationStatusLabel
        ] ?? application.status;

      return [
        `**${position}. ${application.username ?? "Nieznany użytkownik"}**`,
        `**Użytkownik:** <@${application.discordId}>`,
        `Discord ID: ${application.discordId ?? "brak"}`,
        `Status: ${statusLabel}`,
        `Data: ${createdAt}`,
      ].join("\n");
    })
    .join("\n\n");

  return new EmbedBuilder()
    .setColor(config.mainColour as `#${string}`)
    .setTitle(`${config.serverName} - Podania`)
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: `Strona ${page + 1}/${totalPages} - Developed by Alvv`,
      iconURL: interaction.client.user?.displayAvatarURL() || undefined,
    });
};

const botInfo = {
  data: new SlashCommandBuilder()
    .setName("podania")
    .setDescription("Wyswietl kto wysłał podanie"),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      return interaction.reply({
        content: "Tej komendy można używać tylko na serwerze!",
        ephemeral: true,
      });
    }

    const hasRole = config.allowedRoleIds.some((roleId) =>
      interaction.member.roles.cache.has(roleId),
    );

    if (!hasRole) {
      return interaction.reply({
        content: "Nie masz uprawnień do użycia tej komendy!",
        ephemeral: true,
      });
    }

    const res = await fetch(
      "http://localhost:2877/api/applications?limit=100",
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      return interaction.reply({
        content: "Nie udało się pobrać listy podań.",
        ephemeral: true,
      });
    }

    const applications = (await res.json()) as Array<{
      id: number;
      status: string;
      createdAt: string;
      discordId: string | null;
      username: string | null;
    }>;

    if (!applications.length) {
      return interaction.reply({
        content: "Brak podań do wyświetlenia.",
        ephemeral: true,
      });
    }

    const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE));
    let currentPage = 0;

    const message = await interaction.reply({
      embeds: [createApplicationsEmbed(interaction, applications, currentPage)],
      components:
        totalPages > 1 ? [createPageRow(currentPage, totalPages)] : [],
      ephemeral: true,
      fetchReply: true,
    });

    if (totalPages <= 1) {
      return;
    }

    const collector = message.createMessageComponentCollector({
      filter: (componentInteraction) =>
        componentInteraction.user.id === interaction.user.id &&
        componentInteraction.message.id === message.id,
      time: 120_000,
    });

    collector.on("collect", async (componentInteraction) => {
      const [prefix, action, page] = componentInteraction.customId.split(":");

      if (prefix !== "applications") {
        return;
      }

      const pageNumber = Number(page);

      if (action === "prev") {
        currentPage = Math.max(0, pageNumber - 1);
      }

      if (action === "next") {
        currentPage = Math.min(totalPages - 1, pageNumber + 1);
      }

      await componentInteraction.update({
        embeds: [
          createApplicationsEmbed(interaction, applications, currentPage),
        ],
        components: [createPageRow(currentPage, totalPages)],
      });
    });

    collector.on("end", async () => {
      if (message.deletable) {
        await message.edit({
          components: [],
        });
      }
    });
  },
};

export default botInfo;
