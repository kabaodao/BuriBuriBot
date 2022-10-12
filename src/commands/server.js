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
      const instanceState = await getInstanceState();
      if (interaction.options.getSubcommand() === 'start') {
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
          await interaction.reply('Server is running!');
        } else if (instanceState === 'pending') {
          await interaction.reply('Server is pending!');
        } else {
          await interaction.reply('Server is already running!');
        }
      } else if (interaction.options.getSubcommand() === 'stop') {
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
        } else if (instanceState === 'pending') {
          await interaction.reply('Server is pending!');
        } else {
          await interaction.reply('Server is already stopped!');
        }
      }
    } else {
      await interaction.reply('You can not use this command.');
    }
  },
};

const getInstanceDescribe = () => {
  return new Promise((resolve) => {
    ec2.describeInstances({}, (err, data) => {
      if (err) {
        console.log('Error', err.stack);
      } else {
        resolve(data.Reservations[0].Instances[0]);
      }
    });
  });
};

const getInstanceState = async () => {
  const instanceData = await getInstanceDescribe();

  return instanceData.State.Name;
};

const getInstanceIp = async () => {
  const instanceData = await getInstanceDescribe();
  let ip = 'None';
  if (instanceData.State.Name === 'running') {
    ip = instanceData.PublicIpAddress;
    return ip;
  }

  return ip;
};
