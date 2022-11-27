const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change nickname.')
    .addUserOption((option) =>
      option.setName('user').setDescription('Select user.').setRequired(true),
    )
    .addStringOption((option) => option.setName('nickname').setDescription('Enter new nickname.')),

  async execute(interaction) {
    const user = `<@${interaction.user.id}>`;
    const selectUser = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');
    const userOfGuild = interaction.options.getMember('user');

    try {
      if (nickname === null) {
        await userOfGuild.setNickname(null);
        await interaction.reply(`${user} reset nickname of ${selectUser}.`);
      } else {
        await userOfGuild.setNickname(nickname);
        await interaction.reply(`${user} changed nickname of ${selectUser}.`);
      }
    } catch (error) {
      console.log(error);
      await interaction.reply('Error occurred.');
    }
  },
};
