
```markdown
# Discord Role Bot

This is a Discord bot that allows users to assign and remove roles by reacting to a message with specific emojis.

## Features

- Automatically sends a setup message with role information.
- Assigns roles to users when they react to the setup message.
- Removes roles from users when they remove their reaction.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A Discord bot application created in the [Discord Developer Portal](https://discord.com/developers/applications).
- Necessary intents enabled for the bot in the Developer Portal:
  - Presence Intent
  - Server Members Intent
  - Message Content Intent

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies by running:
   ```bash
   npm install discord.js
   ```

## Configuration

1. Open the `index.js` file.
2. Replace `'YOUR_BOT_TOKEN'` with your bot token in the `client.login` method.
3. Configure the roles and corresponding emojis in the `roles` object.
   ```javascript
   const roles = {
       '🔴': 'RoleName1', // Replace with your role names and the emojis you want to use
       '🔵': 'RoleName2',
       // Add more roles and emojis as needed
   };
   ```
4. Set the `rolesMessageID` to the ID of the message you want users to react to for role assignment. If you want the bot to send this message, leave it as is and use the `!setupRoles` command.

## Usage

1. Start the bot by running:
   ```bash
   node index.js
   ```
2. Once the bot is online, go to your Discord server and type `!setupRoles` in any text channel where the bot has permission to send messages.
3. The bot will send an embedded message with the role instructions and react with the specified emojis.
4. Users can react to the message to get the roles and remove their reactions to remove the roles.

## Detailed Explanation

### Initialization

The bot is initialized with the necessary intents and partials for handling guilds, messages, reactions, and members.

```javascript
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
```

### Role Configuration

A set of roles is defined, each associated with an emoji.

```javascript
const roles = {
    '🔴': 'RoleName1',
    '🔵': 'RoleName2',
};
```

### Bot Login Event

When the bot logs in, a message is printed to the console.

```javascript
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
```

### Message Create Event

When a new message is created, the bot checks if it is the command `!setupRoles`. If it is, it sends an embed message to the channel and reacts with the specified emojis.

```javascript
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content === '!setupRoles') {
        const embed = new EmbedBuilder()
            .setTitle('Set your roles')
            .setDescription('React to this message to pick the role.\n\n🔴: RoleName1\n🔵: RoleName2')
            .setColor('#00AAFF');

        try {
            const sentMessage = await message.channel.send({ embeds: [embed] });
            for (const emoji of Object.keys(roles)) {
                await sentMessage.react(emoji);
            }
            rolesMessageID = sentMessage.id;
            console.log(`Roles message ID set to: ${rolesMessageID}`);
        } catch (error) {
            console.error('Failed to send setup message:', error);
        }
    }
});
```

### Reaction Add Event

When a reaction is added, the bot checks if it is on the roles message and not from a bot. It then assigns the corresponding role to the user.

```javascript
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.id !== rolesMessageID || user.bot) return;

    const roleName = roles[reaction.emoji.name];
    if (!roleName) return;

    const role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
    if (!role) return;

    const member = reaction.message.guild.members.cache.get(user.id);
    if (member.roles.cache.has(role.id)) return;

    try {
        await member.roles.add(role);
        console.log(`Added role ${roleName} to user ${user.tag}`);
    } catch (error) {
        console.error('Failed to add role:', error);
    }
});
```

### Reaction Remove Event

When a reaction is removed, the bot checks if it is on the roles message and not from a bot. It then removes the corresponding role from the user.

```javascript
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.id !== rolesMessageID || user.bot) return;

    const roleName = roles[reaction.emoji.name];
    if (!roleName) return;

    const role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
    if (!role) return;

    const member = reaction.message.guild.members.cache.get(user.id);
    if (!member.roles.cache.has(role.id)) return;

    try {
        await member.roles.remove(role);
        console.log(`Removed role ${roleName} from user ${user.tag}`);
    } catch (error) {
        console.error('Failed to remove role:', error);
    }
});
```

## Support

If you have any questions or need further assistance, please feel free to open an issue in the repository or contact the maintainers.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
