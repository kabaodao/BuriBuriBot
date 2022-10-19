const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.getStartRow = () => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('primary')
      .setLabel('Info')
      .setStyle(ButtonStyle.Primary),
  );

  return row;
};
