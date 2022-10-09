const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('discord.js');
const aws = require('aws-sdk');

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
    ),

  async execute(interaction) {
    if (interaction.guild.id === '544782680051679242') {
      if (interaction.options.getSubcommand() === 'start') {
        await interaction.reply('start');

        ec2.startInstances(params, (err) => {
          console.log(err);
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
      } else if (interaction.options.getSubcommand() === 'stop') {
        await interaction.reply('stop');

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
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};
