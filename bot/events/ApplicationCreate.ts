import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  Interaction,
} from "discord.js";
import { modal_id } from "../commands/makeApplication";
import { config } from "../../config";

const pendingApplications = new Map<
  string,
  {
    discordId: string;
    username: string;
    answers: Record<string, string>;
  }
>();

const CONFIRM_PREFIX = "application_confirm:";

const ApplicationCreate = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === modal_id) {
        const answers = Object.fromEntries(
          config.whitelistQuestions.map((question) => [
            question.id,
            interaction.fields.getTextInputValue(question.id),
          ]),
        );

        const confirmationId = `${CONFIRM_PREFIX}${interaction.user.id}:${Date.now()}`;

        pendingApplications.set(confirmationId, {
          discordId: interaction.user.id,
          username: interaction.user.username,
          answers,
        });

        const embed = new EmbedBuilder()
          .setTitle("Potwierdzenie podania")
          .setDescription("Sprawdź dane i kliknij przycisk, aby wysłać podanie")
          .setColor(config.mainColour as `#${string}`)
          .addFields(
            {
              name: "Discord ID",
              value: interaction.user.id,
            },
            {
              name: "Twoja nazwa:",
              value: interaction.user.username,
            },
            ...config.whitelistQuestions.map((question) => ({
              name: question.label,
              value: answers[question.id]?.slice(0, 1024) || "Brak odpowiedzi",
            })),
          )
          .setTimestamp()
          .setFooter({
            text: "Developed by Alvv",
            iconURL: interaction.client.user?.displayAvatarURL() || undefined,
          });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(confirmationId)
            .setLabel("Potwierdź i wyślij")
            .setStyle(ButtonStyle.Success),
        );

        await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
      }
      return;
    }

    if (
      interaction.isButton() &&
      interaction.customId.startsWith(CONFIRM_PREFIX)
    ) {
      const userId = interaction.customId
        .slice(CONFIRM_PREFIX.length)
        .split(":")[0];

      if (interaction.user.id !== userId) {
        await interaction.reply({
          content: "Ten przycisk nie jest dla Ciebie.",
          ephemeral: true,
        });
        return;
      }

      const pending = pendingApplications.get(interaction.customId);

      if (!pending) {
        await interaction.reply({
          content: "To potwierdzenie wygasło. Wypełnij formularz ponownie.",
          ephemeral: true,
        });
        return;
      }

      const response = await fetch("http://localhost:2877/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
        body: JSON.stringify(pending),
      });

      pendingApplications.delete(interaction.customId);

      if (!response.ok) {
        const errorData = await response.json();
        await interaction.update({
          content: errorData.error,
          embeds: [],
          components: [],
        });
        return;
      }

      await interaction.update({
        content: "Twoje podanie zostało wysłane.",
        embeds: [],
        components: [],
      });
    }
  },
};

export default ApplicationCreate;
