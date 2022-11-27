const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Change role.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a specified role.')
        .addRoleOption((option) =>
          option.setName('role').setDescription('Select role.').setRequired(true),
        )
        .addUserOption((option) =>
          option.setName('user').setDescription('Select user.').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a specified role')
        .addRoleOption((option) =>
          option.setName('role').setDescription('Select role.').setRequired(true),
        )
        .addUserOption((option) =>
          option.setName('user').setDescription('Select user.').setRequired(true),
        ),
    ),

  async execute(interaction) {
    const user = `<@${interaction.user.id}>`;
    const role = interaction.options.getRole('role');
    const selectUser = interaction.options.getUser('user');
    const userOfGuild = interaction.options.getMember('user');

    if (interaction.options.getSubcommand() === 'add') {
      if (interaction.member.roles.cache.has('844246216560607233')) {
        try {
          await userOfGuild.roles.add(role);
          await interaction.reply(`${user} added ${role} role to ${selectUser}.`);
        } catch (error) {
          console.log(error);
          await interaction.reply('Error occurred.');
        }
      } else {
        await interaction.reply("You can't use this command.");
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      if (interaction.member.roles.cache.has('844246216560607233')) {
        try {
          await userOfGuild.roles.remove(role);
          await interaction.reply(`${user} removed ${role} role of ${selectUser}.`);
        } catch (error) {
          console.log(error);
          await interaction.reply('Error occurred.');
        }
      } else {
        await interaction.reply("You can't use this command.");
      }
    }
  },
};
