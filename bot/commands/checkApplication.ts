import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../../config";

const APPROVE_PREFIX = "application_status:approved:";
const REJECT_PREFIX = "application_status:rejected:";
const KEEP_PREFIX = "application_status:keep:";

type ApplicationStatus = keyof typeof config.applicationStatusLabel;

const exampleCommand = {
  data: new SlashCommandBuilder()
    .setName("checkapplication")
    .setDescription("Sprawdza podanie użytkownika po ID Discorda")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("ID użytkownika z Discorda")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction | Interaction) {
    if (interaction.isButton()) {
      const parts = interaction.customId.split(":");
      const actionType = parts[1];
      const userId = parts[2];
      console.log(actionType);
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

      const response = await fetch(
        `http://localhost:2877/api/applications/${userId}`,
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
        await interaction.reply({
          content: "Nie udało się zmienić statusu podania.",
          ephemeral: true,
        });
        return;
      }

      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(config.mainColour as `#${string}`)
            .setTitle(config.serverName)
            .setDescription(`Zaktulizowano status użytkonika: <@${userId}>`)
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
      `http://localhost:2877/api/applications/${userId}`,
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
      .setColor(0x2b2d31)
      .addFields(
        { name: "Discord ID", value: String(application.discordId ?? userId) },
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
