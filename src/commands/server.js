const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('discord.js');
const svm = require('../modules/server_module.js');

dotenv.config({ path: '../.env' });

module.exports = {
  data: new SlashCommandBuilder().setName('server').setDescription('None'),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      const subCommand = interaction.options.getSubcommand();
      const instanceState = await svm.getInstanceState();
      if (subCommand === 'start') {
        if (instanceState === 'stopped') {
          const row = svm.getStartRow();
          svm.startInstance();
          await interaction.reply({
            content: 'Server is starting!',
            components: [row],
          });
        } else {
          await interaction.reply(`Server is ${instanceState}!`);
        }
      } else if (subCommand === 'stop') {
        if (instanceState === 'running') {
          svm.stopInstance();
          await interaction.reply('Server is stopping!');
        } else {
          await interaction.reply(`Server is ${instanceState}!`);
        }
      } else if (subCommand === 'info') {
        const ip = await svm.getInstanceIp();
        await interaction.reply(
          `\`State\`: *${instanceState}*\n\`IP\`: ||${ip}||`,
        );
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
