import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  Interaction,
} from "discord.js";
import { config } from "../../config";

export const createNoRoleEmbed = (
  interaction: ChatInputCommandInteraction | Interaction,
) => {
  return new EmbedBuilder()
    .setTitle("Brak uprawnień") // Poprawiłem też tytuł, bo wcześniej był "Podanie użytkownika"
    .setColor(config.mainColour as `#${string}`)
    .setDescription("Nie masz wymaganej roli, aby wykonać tę akcję!")
    .setTimestamp()
    .setFooter({
      text: "Developed by Alvv",
      iconURL: interaction.client.user?.displayAvatarURL() || undefined,
    });
};
