import {
  Events,
  Interaction,
  ChatInputCommandInteraction,
  Collection,
} from "discord.js";
import { Client } from "discord.js";

type Command = {
  execute: (
    interaction: ChatInputCommandInteraction | Interaction,
    client: Client,
  ) => Promise<unknown> | unknown;
};

const interactionCreate = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: Client) {
    const clientWithCommands = client as Client & {
      commands: Collection<string, Command>;
    };
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("application_status:")) {
        const command = clientWithCommands.commands.get("checkapplication");
        if (!command) return;

        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error("Błąd podczas obsługi przycisku podania:", error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: "Wystąpił błąd podczas zmiany statusu",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Wystąpił błąd podczas zmiany statusu",
              ephemeral: true,
            });
          }
        }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const chatInteraction = interaction as ChatInputCommandInteraction;
    const command = clientWithCommands.commands.get(
      chatInteraction.commandName,
    );
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Wystąpił błąd podczas wykonywania tej komendy",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Wystąpił błąd podczas wykonywania tej komendy",
          ephemeral: true,
        });
      }
    }
  },
};

export default interactionCreate;
