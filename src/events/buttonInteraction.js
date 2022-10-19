const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const filter = (i) => i.customId === 'info';

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();
      await i.editReply({ content: 'HeHe', components: [] });
      console.log('fdsiljfldajsdkj');
    });
    console.log('a');
  },
};
