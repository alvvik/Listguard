import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  version as djsVersion,
} from "discord.js";
import os from "node:os";
import { config } from "../../config";

const botInfo = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Zobacz informacje o bocie!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const totalSeconds = interaction.client.uptime
      ? interaction.client.uptime / 1000
      : 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2,
    );
    const totalSystemMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    const cpuCores = os.cpus().length;
    const cpuModel = os.cpus()[0]?.model || "Ziemniak";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const embed = new EmbedBuilder()
      .setColor(config.mainColour as `#${string}`)
      .setTitle(config.serverName)
      .setDescription(
        "Informacje o bocie [developed by Alvv](https://github.com/alvvik)",
      )
      .addFields(
        {
          name: "Czas działania:",
          value: `${hours} godz. ${minutes} min`,
          inline: true,
        },
        {
          name: "Lokalizacje / Strefa:",
          value: timezone,
          inline: true,
        },
        {
          name: "Zużycie RAM:",
          value: `${usedMemory} MB / ${totalSystemMemory} GB`,
          inline: true,
        },
        {
          name: "Rdzenie CPU:",
          value: `${cpuCores} (Model: ${cpuModel})`,
          inline: true,
        },
        {
          name: "Wersje:",
          value: `Node.js: ${process.version}\nDiscord.js: v${djsVersion}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({
        text: "Developed by Alvv",
        iconURL: interaction.client.user?.displayAvatarURL() || undefined,
      });

    await interaction.reply({ embeds: [embed] });
  },
};

export default botInfo;
