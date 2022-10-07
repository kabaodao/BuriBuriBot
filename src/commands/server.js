const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('None')
    .addSubcommand((subcommand) =>
      subcommand.setName('start').setDescription('Start the server.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stop').setDescription('Stop the server.'),
    ),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      if (interaction.options.getSubcommand() === 'start') {
        await interaction.reply('start');
      } else if (interaction.options.getSubcommand() === 'stop') {
        await interaction.reply('stop');
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
