const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

let clientId = process.env.DISCORD_CLIENT_ID;
let token = process.env.DISCORD_TOKEN;
if (process.argv[2] === 'dev') {
  clientId = process.env.DEV_DISCORD_CLIENT_ID;
  token = process.env.DEV_DISCORD_TOKEN;
}
const guildId = process.env.DISCORD_GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// rest
//   .delete(
//     Routes.applicationGuildCommand(clientId, guildId, '984715369027608617'),
//   )
//   .then(() => console.log('Successfully deleted guild command'))
//   .catch(console.error);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`),
  )
  .catch(console.error);
