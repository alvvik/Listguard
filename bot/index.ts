import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import http from "node:http";
import { Client, Collection, GatewayIntentBits } from "discord.js";

interface BotCommand {
  data: { name: string };
  execute: (interaction: unknown) => Promise<unknown> | unknown;
}

interface CustomClient extends Client {
  commands: Collection<string, BotCommand>;
}

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
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

  const server = http.createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/check-role") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const data = JSON.parse(body);
          const { secretKey, userId, allowedRoleIds, guildId } = data;

          if (secretKey !== process.env.TOKEN) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid secret key" }));
            return;
          }

          if (!userId || !allowedRoleIds || !guildId) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Missing required fields" }));
            return;
          }

          const guild = await client.guilds.fetch(guildId);
          const member = await guild.members.fetch(userId);
          const hasRole = allowedRoleIds.some((roleId: string) =>
            member.roles.cache.has(roleId),
          );

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ hasRole }));
        } catch (error) {
          console.error("Endpoint error: ", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  });

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
}

void main();
