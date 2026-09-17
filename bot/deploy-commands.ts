import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { REST, Routes } from "discord.js";

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

(async () => {
  try {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.default ?? commandModule;

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      }
    }

    console.log("Zaczetto odświeżać");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.SERVER_ID!,
      ),
      { body: commands },
    );

    console.log("zarejestrowano komendy");
  } catch (error) {
    console.error(error);
  }
})();
