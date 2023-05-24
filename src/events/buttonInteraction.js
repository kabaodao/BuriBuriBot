const { Events } = require('discord.js');
const svm = require('../modules/server_module.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const state = await svm.getInstanceState();

    if (interaction.member.roles.cache.has('1105715047134675056')) {
      if (interaction.customId === 'start') {
        if (state === 'stopped') {
          try {
            await svm.startInstance();
            const embed = await svm.getEmbed('Server is starting!');
            await interaction.update({
              embeds: [embed],
            });
            await interaction.followUp(`<@${interaction.user.id}> has started the server!`);
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const embed = await svm.getEmbed(`Server is already ${state}!`);
            await interaction.update({
              embeds: [embed],
            });
          } catch (e) {
            console.log(e);
          }
        }
      } else if (interaction.customId === 'stop') {
        if (state === 'running') {
          try {
            await svm.stopInstance();
            const embed = await svm.getEmbed('Server is stopping!');
            await interaction.update({
              embeds: [embed],
            });
            await interaction.followUp(`<@${interaction.user.id}> has stopped the server!`);
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const embed = await svm.getEmbed(`Server is already ${state}!`);
            await interaction.update({
              embeds: [embed],
            });
          } catch (e) {
            console.log(e);
          }
        }
      } else if (interaction.customId === 'info') {
        try {
          const embed = await svm.getEmbed('Reload embed!');
          await interaction.update({
            embeds: [embed],
          });
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
