import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../../config";
import { createNoRoleEmbed } from "../embeds/createNoRoleEmbed";

const APPROVE_PREFIX = "application_status:approved:";
const REJECT_PREFIX = "application_status:rejected:";
const KEEP_PREFIX = "application_status:keep:";

type ApplicationStatus = keyof typeof config.applicationStatusLabel;

const exampleCommand = {
  data: new SlashCommandBuilder()
    .setName("sprawdzpodanie")
    .setDescription("Sprawdza podanie użytkownika po ID Discorda")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("ID użytkownika z Discorda")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction | Interaction) {
    const member = interaction.member as GuildMember;

    if (!member) {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: "Tej komendy można używać tylko na serwerze.",
          ephemeral: true,
        });
      }
      return;
    }

    const hasRole = config.allowedRoleIds.some((roleId) =>
      member.roles.cache.has(roleId),
    );

    if (!hasRole) {
      if (interaction.isRepliable()) {
        await interaction.reply({
          embeds: [createNoRoleEmbed(interaction)],
          ephemeral: true,
        });
      }
      return;
    }
    if (interaction.isButton()) {
      console.log("Button interaction detected");
      const parts = interaction.customId.split(":");
      const actionType = parts[1];
      const userId = parts[2];
      if (actionType === "keep") {
        await interaction.update({
          content: "Anulowano. Status pozostał bez zmian.",
          embeds: [],
          components: [],
        });
        return;
      }

      const dbStatus: ApplicationStatus =
        actionType === "approved" ? "approved" : "rejected";

      await interaction.deferUpdate();

      const response = await fetch(
        `${process.env.API_URL}/api/applications/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
          body: JSON.stringify({ status: dbStatus }),
        },
      );

      if (!response.ok) {
        await interaction.editReply({
          content: "Nie udało się zmienić statusu podania.",
          embeds: [],
          components: [],
        });
        return;
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.mainColour as `#${string}`)

            .setTitle(config.serverName)
            .setDescription(`Zaktulizowano status użytkonika: **<@${userId}>**`)
            .addFields({
              name: "Aktualny status:",
              value: config.applicationStatusLabel[dbStatus],
            })
            .setTimestamp()
            .setFooter({
              text: "Developed by Alvv",
              iconURL: interaction.client.user?.displayAvatarURL() || undefined,
            }),
        ],
        components: [],
      });
      return;
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const userId = interaction.options.getString("userid", true);

    const response = await fetch(
      `${process.env.API_URL}/api/applications/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      await interaction.reply({
        content: "Nie znaleziono podania dla tego ID",
        ephemeral: true,
      });
      return;
    }

    const application = await response.json();
    const answers = JSON.parse(application.answers);
    const embed = new EmbedBuilder()
      .setTitle("Podanie użytkownika")
      .setColor(config.mainColour as `#${string}`)
      .addFields(
        { name: "Discord ID", value: String(application.discordId ?? userId) },
        {
          name: "Aktualny status",
          value: `**${
            config.applicationStatusLabel[
              application.status as ApplicationStatus
            ] ?? "Brak statusu"
          }**`,
        },
        { name: "Nazwa", value: String(application.username ?? "Brak") },
        ...Object.entries(answers).map(([key, value]) => ({
          name: String(key),
          value: String(value).slice(0, 1024) || "Brak odpowiedzi",
        })),
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`${APPROVE_PREFIX}${userId}`)
        .setLabel("Akceptuj")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`${REJECT_PREFIX}${userId}`)
        .setLabel("Odrzuć")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`${KEEP_PREFIX}${userId}`)
        .setLabel("Zostaw ten sam status")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};

export default exampleCommand;
