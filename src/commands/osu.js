const { SlashCommandBuilder } = require('discord.js');

const om = require('../modules/osu_module.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('osu')
    .setDescription('Shows information related to Osu!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription("Shows the user's top map.")
        .addStringOption((option) =>
          option
            .setName('user-name')
            .setDescription('Type your user name or id of Osu!')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('Choice Score type of Osu!')
            .setRequired(true)
            .addChoices(
              { name: 'best', value: 'best' },
              { name: 'recent', value: 'recent' },
            ),
        )
        .addStringOption((option) =>
          option
            .setName('mode')
            .setDescription('Choice game mode of Osu!')
            .addChoices(
              { name: 'Standard', value: 'osu' },
              { name: 'Taiko', value: 'taiko' },
              { name: 'Mania', value: 'mania' },
              { name: 'Catch', value: 'fruits' },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('map')
        .setDescription('Shows the map.')
        .addStringOption((option) =>
          option
            .setName('map-id')
            .setDescription('Type map id of Osu!')
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'user') {
      const userName = interaction.options.getString('user-name');
      const type = interaction.options.getString('type');
      const mode = interaction.options.getString('mode');

      const embed = om.createUserEmbed(
        await om.getOsuUserData(userName, type, mode),
        type,
      );
      await interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === 'map') {
      const mapId = interaction.options.getString('map-id');

      console.log(await om.getOsuMapData(mapId));
      await interaction.reply('None');
    }
  },
};
