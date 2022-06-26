const guildId = '544782680051679242';
const channelId = '986577144568246272';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.author.bot) {
      if (message.guildId === guildId) {
        if (message.content.startsWith('http')) {
          const channel = message.guild.channels.cache.get(channelId);
          channel.send(message.content).catch(console.error);
        } else {
          console.log(message.attachments);
        }
      }
    }
  },
};
