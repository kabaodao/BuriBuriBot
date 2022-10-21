const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('discord.js');
const aws = require('aws-sdk');
const svm = require('../modules/server_module.js');

dotenv.config({ path: '../.env' });

aws.config.update({
  region: process.env.AWS_REGION,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('None')
    .addSubcommand((subcommand) =>
      subcommand.setName('start').setDescription('Start the server.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stop').setDescription('Stop the server.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('info').setDescription('Show the server information.'),
    ),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      const subCommand = interaction.options.getSubcommand();
      const instanceState = await svm.getInstanceState();
      const row = svm.getStartRow();
      if (subCommand === 'start') {
        if (instanceState === 'stopped') {
          svm.startInstance();

          await interaction.reply({
            content: 'Server is starting!',
            components: [row],
          });
        } else {
          await interaction.reply(`Server is ${row}!`);
        }
      } else if (subCommand === 'stop') {
        if (instanceState === 'running') {
          svm.stopInstance();

          await interaction.reply('Server is stopped!');
        } else {
          await interaction.reply(`Server is ${row}`);
        }
      } else if (subCommand === 'info') {
        const ip = await svm.getInstanceIp();
        await interaction.reply(
          `\`State\`: *${instanceState}*\n\`IP\`: ||${ip}||`,
        );
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
