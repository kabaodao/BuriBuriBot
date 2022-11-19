const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('discord.js');
const svm = require('../modules/server_module.js');

dotenv.config({ path: '../.env' });

module.exports = {
  data: new SlashCommandBuilder().setName('server').setDescription('None'),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      const embed = await svm.getEmbed('Typed /server command !');
      const row = await svm.getServerCommandRow();
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
