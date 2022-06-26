const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('vroll').setDescription('divide'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
