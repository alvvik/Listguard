import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Client, Collection, GatewayIntentBits } from "discord.js";

interface BotCommand {
  data: { name: string };
  execute: (interaction: unknown) => Promise<unknown> | unknown;
}

interface CustomClient extends Client {
  commands: Collection<string, BotCommand>;
}

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as CustomClient;
client.commands = new Collection();

async function main() {
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default || commandModule;
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command as BotCommand);
    }
  }

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const eventModule = await import(pathToFileURL(filePath).href);
    const event = eventModule.default || eventModule;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  await client.login(process.env.TOKEN);
}

void main();
