const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Divide by the members in the voice chat for 5vs5.')
    .addChannelOption((option) =>
      option
        .setName('voice_channel')
        .setDescription('Chose voice channel.')
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName('user_1')
        .setDescription(
          'Please enter the player to be excluded. (Only if it over)',
        ),
    )
    .addUserOption((option) =>
      option
        .setName('user_2')
        .setDescription(
          'Please enter the player to be excluded. (Only if it over)',
        ),
    )
    .addUserOption((option) =>
      option
        .setName('user_3')
        .setDescription(
          'Please enter the player to be excluded. (Only if it over)',
        ),
    ),

  async execute(interaction) {
    const membersMap = interaction.options.getChannel('voice_channel').members;
    const membersCount = membersMap.size;

    if (membersCount === 10) {
      await interaction.reply({
        embeds: [createEmbed(rollMembers(membersMap))],
      });
    } else if (membersCount < 10) {
      await interaction.reply('Need 10 people.');
      // await interaction.reply({
      //   embeds: [createEmbed(rollMembers(membersMap))],
      // });
    } else if (membersCount > 10) {
      await interaction.reply('Only 10 people.');
    }
  },
};

const rollMembers = (map) => {
  const membersArray = [];

  map.forEach((value, key) => {
    membersArray.push(key);
  });

  const array = membersArray.slice();
  for (let i = array.length - 1; i >= 0; i--) {
    const n = Math.random();
    const j = Math.floor(n * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const createEmbed = (array) => {
  let teamAStr = '';
  let teamBStr = '';

  array.forEach((currentValue, index) => {
    if (index <= 4) {
      teamAStr += `<@${currentValue}>\n`;
    } else {
      teamBStr += `<@${currentValue}>\n`;
    }
  });

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Result')
    .addFields(
      { name: 'Team A', value: `${teamAStr}`, inline: true },
      { name: 'vs', value: 'ㅤ', inline: true },
      { name: 'Team B', value: `${teamBStr}`, inline: true },
    );

  return embed;
};
