const dotenv = require('dotenv');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
const {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
  DescribeInstancesCommand,
} = require('@aws-sdk/client-ec2');

dotenv.config({ path: '../.env' });

const client = new EC2Client({ region: 'ap-northeast-1' });

exports.startInstance = async () => {
  const dryrunCommand = new StartInstancesCommand({
    DryRun: true,
    InstanceIds: [process.env.AWS_INSTANCE_ID],
  });
  try {
    await client.send(dryrunCommand);
  } catch (e) {
    if (e.Code === 'DryRunOperation') {
      const command = new StartInstancesCommand({
        InstanceIds: [process.env.AWS_INSTANCE_ID],
      });
      const response = await client.send(command);

      return response;
    } else {
      return e;
    }
  }
};

exports.stopInstance = async () => {
  const dryrunCommand = new StopInstancesCommand({
    DryRun: true,
    InstanceIds: [process.env.AWS_INSTANCE_ID],
  });
  try {
    await client.send(dryrunCommand);
  } catch (e) {
    if (e.Code === 'DryRunOperation') {
      const command = new StopInstancesCommand({
        InstanceIds: [process.env.AWS_INSTANCE_ID],
      });
      const response = await client.send(command);

      return response;
    } else {
      return e;
    }
  }
};

const getInstanceDescribe = async () => {
  const dryrunCommand = new DescribeInstancesCommand({
    DryRun: true,
    InstanceIds: [process.env.AWS_INSTANCE_ID],
  });
  try {
    await client.send(dryrunCommand);
  } catch (e) {
    if (e.Code === 'DryRunOperation') {
      const command = new DescribeInstancesCommand({
        InstanceIds: [process.env.AWS_INSTANCE_ID],
      });
      const response = await client.send(command);

      return response;
    } else {
      return e;
    }
  }
};

exports.getInstanceState = async () => {
  const instanceDescribe = await getInstanceDescribe();
  return instanceDescribe.Reservations[0].Instances[0].State.Name;
};

exports.getInstanceIp = async () => {
  const instanceDescribe = await getInstanceDescribe();
  let ip = 'None';
  if (instanceDescribe.Reservations[0].Instances[0].State.Name === 'running') {
    ip = instanceDescribe.Reservations[0].Instances[0].PublicIpAddress;
    return ip;
  }

  return ip;
};

exports.getEmbed = async (text) => {
  const state = await this.getInstanceState();
  const ip = await this.getInstanceIp();

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Server')
    .setDescription(`Log: ${text}`)
    .addFields({ name: 'State', value: `${state}`, inline: true })
    .addFields({ name: 'IP', value: `||${ip}||`, inline: true })
    .setTimestamp();

  return embed;
};

exports.getServerCommandRow = () => {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('start')
        .setLabel('Start')
        .setStyle(ButtonStyle.Success),
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger),
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId('info')
        .setLabel('Info')
        .setStyle(ButtonStyle.Primary),
    );
  return row;
};
