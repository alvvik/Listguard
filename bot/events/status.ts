/* eslint-disable import/no-anonymous-default-export */
import { Events, Client, ActivityType } from "discord.js";
import { config } from "../../config";

const customStatus = [
  "Stwórz formularz aby zdać whiteliste!",
  "odwiedź naszą strone!",
  config.domain,
  "Developed by alvv",
  "https://github.com/alvvik",
];

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    const setRandomStatus = () => {
      const status =
        customStatus[Math.floor(Math.random() * customStatus.length)];
      client.user?.setActivity(status, { type: ActivityType.Playing });
    };

    // Ustaw status od razu przy starcie
    setRandomStatus();

    // Zmieniaj co 30 sekund
    setInterval(setRandomStatus, 10000);
  },
};
