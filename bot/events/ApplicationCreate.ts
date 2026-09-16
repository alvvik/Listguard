import { Events, Interaction } from "discord.js";
import { modal_id } from "../commands/makeApplication";
import { config } from "../../config";

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

        const response = await fetch("http://localhost:2877/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
          body: JSON.stringify({
            discordId: interaction.user.id,
            username: interaction.user.username,
            answers,
          }),
        });

        if (!response.ok) {
          await interaction.reply({
            content: "Nie udało się wysłać podania." + response.status,
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          content: "Twoje podanie zostało wysłane.",
          ephemeral: true,
        });
      }
    }
  },
};

export default ApplicationCreate;
