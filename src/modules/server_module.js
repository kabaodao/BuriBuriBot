const dotenv = require('dotenv');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const aws = require('aws-sdk');

dotenv.config({ path: '../.env' });

aws.config.update({
  region: process.env.AWS_REGION,
});

const ec2 = new aws.EC2({
  apiVersion: '2016-11-15',
});

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

exports.getInstanceState = async () => {
  const instanceData = await getInstanceDescribe();

  return instanceData.State.Name;
};

exports.getInstanceIp = async () => {
  const instanceData = await getInstanceDescribe();
  let ip = 'None';
  if (instanceData.State.Name === 'running') {
    ip = instanceData.PublicIpAddress;
    return ip;
  }

  return ip;
};

exports.getStartRow = () => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('info')
      .setLabel('Info')
      .setStyle(ButtonStyle.Primary),
  );

  return row;
};
