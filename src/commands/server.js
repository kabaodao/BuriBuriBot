const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('discord.js');
const aws = require('aws-sdk');
const svm = require('../modules/server_module.js');

dotenv.config({ path: '../.env' });

aws.config.update({
  region: process.env.AWS_REGION,
});

const ec2 = new aws.EC2({
  apiVersion: '2016-11-15',
});

const params = {
  InstanceIds: [process.env.AWS_INSTANCE_ID],
  DryRun: true,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('None')
    .addSubcommand((subcommand) =>
      subcommand.setName('start').setDescription('Start the server.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stop').setDescription('Stop the server.'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('info').setDescription('Show the server information.'),
    ),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      const subCommand = interaction.options.getSubcommand();
      const instanceState = await svm.getInstanceState();
      if (subCommand === 'start') {
        if (instanceState === 'stopped') {
          ec2.startInstances(params, (err) => {
            if (err && err.code === 'DryRunOperation') {
              params.DryRun = false;
              ec2.startInstances(params, (err, data) => {
                if (err) {
                  console.log('Error', err);
                } else if (data) {
                  console.log('Success', data.StartingInstances);
                }
              });
            } else {
              console.log("You don't have permission to start instances.");
            }
          });

          const row = svm.getStartRow();

          await interaction.reply({
            content: 'Server is starting!',
            components: [row],
          });
        } else if (instanceState === 'pending') {
          await interaction.reply('Server is pending!');
        } else {
          await interaction.reply('Server is already running!');
        }
      } else if (subCommand === 'stop') {
        if (instanceState === 'running') {
          ec2.stopInstances(params, (err) => {
            if (err && err.code === 'DryRunOperation') {
              console.log(err);
              params.DryRun = false;
              ec2.stopInstances(params, (err, data) => {
                if (err) {
                  console.log('Error', err);
                } else if (data) {
                  console.log('Success', data.StoppingInstances);
                }
              });
            } else {
              console.log("You don't have permission to stop instances");
            }
          });
          await interaction.reply('Server is stopped!');
        } else if (instanceState === 'stopping') {
          await interaction.reply('Server is stopping!');
        } else {
          await interaction.reply('Server is already stopped!');
        }
      } else if (subCommand === 'info') {
        const nowInstanceState = await svm.getInstanceState();
        const ip = await svm.getInstanceIp();
        await interaction.reply(
          `\`State\`: *${nowInstanceState}*\n\`IP\`: ||${ip}||`,
        );
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
