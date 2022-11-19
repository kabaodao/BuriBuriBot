const { Events } = require('discord.js');
const svm = require('../modules/server_module.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const state = await svm.getInstanceState();
    if (interaction.customId === 'start') {
      if (state === 'stopped') {
        svm.startInstance();
        const embed = await svm.getEmbed('Server is starting!');
        await interaction.update({
          embeds: [embed],
        });
      } else {
        const embed = await svm.getEmbed(`Server is ${state}!`);
        await interaction.update({
          embeds: [embed],
        });
      }
    } else if (interaction.customId === 'stop') {
      if (state === 'running') {
        svm.stopInstance();
        const embed = await svm.getEmbed('Server is stopping!');
        await interaction.update({
          embeds: [embed],
        });
      } else {
        const embed = await svm.getEmbed(`Server is ${state}!`);
        await interaction.update({
          embeds: [embed],
        });
      }
    } else if (interaction.customId === 'info') {
      const embed = await svm.getEmbed('Reload embed!');
      await interaction.update({
        embeds: [embed],
      });
    }
  },
};
