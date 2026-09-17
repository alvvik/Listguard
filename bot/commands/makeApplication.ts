import {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} from "discord.js";
import { config } from "../../config";

const modal_id = "whitelistApplicationForm";

const createInputStyle = (style: "short" | "paragraph") =>
  style === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short;

const makeApplication = {
  data: new SlashCommandBuilder()
    .setName("aplikuj")
    .setDescription("Złóż aplikację o whiteliste!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId(modal_id)
      .setTitle("Formularz whitelisty");

    const rows = config.whitelistQuestions.map((question) => {
      const input = new TextInputBuilder()
        .setCustomId(question.id)
        .setLabel(question.label)
        .setStyle(createInputStyle(question.style))
        .setRequired(question.required ?? true);

      return new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    });

    modal.addComponents(...rows);

    await interaction.showModal(modal);
  },
};

export default makeApplication;
export { modal_id };
