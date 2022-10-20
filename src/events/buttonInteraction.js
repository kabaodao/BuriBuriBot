const { Events } = require('discord.js');
const svm = require('../modules/server_module.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'info') {
      const nowInstanceState = await svm.getInstanceState();
      const ip = await svm.getInstanceIp();
      await interaction.reply(
        `\`State\`: *${nowInstanceState}*\n\`IP\`: ||${ip}||`,
      );
    }
  },
};
