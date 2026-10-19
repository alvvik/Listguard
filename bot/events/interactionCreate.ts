import {
  Events,
  Interaction,
  ChatInputCommandInteraction,
  Collection,
  Client,
} from "discord.js";

type Command = {
  execute: (
    interaction: ChatInputCommandInteraction | Interaction,
    client: Client
  ) => Promise<unknown> | unknown;
};

// Mapa przechowująca cooldowny: Map<commandName, Map<userId, timestamp>>
const cooldowns = new Collection<string, Collection<string, number>>();

const interactionCreate = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: Client) {
    const clientWithCommands = client as Client & {
      commands: Collection<string, Command>;
    };

    if (interaction.isButton()) {
      if (interaction.customId.startsWith("application_status:")) {
        const command = clientWithCommands.commands.get("sprawdzpodanie");
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
      chatInteraction.commandName
    );
    if (!command) return;

    const cooldownSeconds = 3;
    const commandName = chatInteraction.commandName;
    const userId = chatInteraction.user.id;

    if (!cooldowns.has(commandName)) {
      cooldowns.set(commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(commandName)!;
    const cooldownAmount = cooldownSeconds * 1000;

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId)! + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        await chatInteraction.reply({
          content: `Poczekaj jeszcze **${timeLeft.toFixed(1)}** sekund przed ponownym użyciem tej komendy.`,
          ephemeral: true,
        });
        return;
      }
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);

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
