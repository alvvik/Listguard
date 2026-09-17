import { Events, Client, ActivityType } from "discord.js";
import { config } from "../../config";

const customStatus = [
  "Stwórz formularz aby zdać whiteliste!",
  "odwiedź naszą strone!",
  config.domain,
  "Developed by alvv",
  "https://github.com/alvvik",
];

const ready = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`Zalogowano jako ${client.user?.tag}`);

    const setRandomStatus = () => {
      const status =
        customStatus[Math.floor(Math.random() * customStatus.length)];
      client.user?.setActivity(status, { type: ActivityType.Playing });
    };
    setRandomStatus();
    setInterval(setRandomStatus, 10000);
  },
};
export default ready;
