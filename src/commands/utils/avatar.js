module.exports = {
  name: "avatar",
  description: "Displays user avatar",
  usage: "/avatar [user]",
  aliases: ["av", "pfp"],
  cooldown: "5s",

  options: [
    {
      name: "user",
      description: "User to get avatar",
      type: 6, // 6 = User (USER type)
      required: false,
    },
  ],

  async executePrefix(message, args) {
    const user = message.mentions.users.first() || message.author;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });

    const avatarEmbed = {
      color: 0x0099ff, // Warna untuk embed
      title: `${user.tag}'s Avatar`,
      image: {
        url: avatarURL,
      },
      description: `[PNG](${avatarURL.replace(
        /\.[a-z]+$/,
        ".png"
      )}) | [JPG](${avatarURL.replace(
        /\.[a-z]+$/,
        ".jpg"
      )}) | [WEBP](${avatarURL.replace(/\.[a-z]+$/, ".webp")})`, // Menampilkan link format gambar
      footer: {
        text: "Requested by " + message.author.tag,
      },
    };
    await message.reply({ embeds: [avatarEmbed] });
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });

    const avatarEmbed = {
      color: 0x0099ff, // Warna untuk embed
      title: `${user.tag}'s Avatar`,
      image: {
        url: avatarURL,
      },
      description: `[PNG](${avatarURL.replace(
        /\.[a-z]+$/,
        ".png"
      )}) | [JPG](${avatarURL.replace(
        /\.[a-z]+$/,
        ".jpg"
      )}) | [WEBP](${avatarURL.replace(/\.[a-z]+$/, ".webp")})`,
      footer: {
        text: "Requested by " + interaction.user.tag,
      },
    };
    await interaction.reply({ embeds: [avatarEmbed] });
  },
};
