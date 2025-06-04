class DiscordMessageSender {
  constructor(destinationChannel) {
    this.channel = destinationChannel;
  }

  async sendMessage(content, fileUrls = []) {
    const options = { content };
    if (fileUrls.length > 0) {
      options.files = fileUrls;
    }

    return await this.channel.send(options);
  }
}

export default DiscordMessageSender;
