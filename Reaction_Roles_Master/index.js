const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

// Create a new client instance with the necessary intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers // Required intent for managing guild members
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction] // Partial structures to cache
});

// ID of the message to which users need to react to get roles
let rolesMessageID = 'YOUR_MESSAGE_ID'; 

// Define the roles and their corresponding emojis
const roles = {
    '🔴': 'NomeRuolo1', // Replace with your role names and the emojis you want to use
    '🔵': 'NomeRuolo2',
    // Add more roles and emojis as needed
};

// Event triggered when the bot successfully logs in
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event triggered when a new message is created
client.on('messageCreate', async message => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Command to set up the roles message
    if (message.content === '!setupRoles') {
        const embed = new EmbedBuilder()
            .setTitle('Set your roles')
            .setDescription('React to this message to pick the role.\n\n🔴: NomeRuolo1\n🔵: NomeRuolo2')
            .setColor('#00AAFF'); // Customize the embed color as needed

        try {
            // Send the embed message to the channel
            const sentMessage = await message.channel.send({ embeds: [embed] });
            // React to the message with the defined emojis
            for (const emoji of Object.keys(roles)) {
                await sentMessage.react(emoji);
            }
            // Save the ID of the sent message for future reference
            rolesMessageID = sentMessage.id;
            console.log(`Roles message ID set to: ${rolesMessageID}`);
        } catch (error) {
            console.error('Failed to send setup message:', error);
        }
    }
});

// Event triggered when a reaction is added to a message
client.on('messageReactionAdd', async (reaction, user) => {
    // Ignore reactions that are not on the roles message or from bots
    if (reaction.message.id !== rolesMessageID || user.bot) return;

    console.log(`Reaction added: ${reaction.emoji.name} by ${user.tag}`);
    
    // Get the role name associated with the emoji
    const roleName = roles[reaction.emoji.name];
    if (!roleName) return;

    // Find the role in the guild by name
    const role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
    if (!role) return;

    // Find the member who reacted
    const member = reaction.message.guild.members.cache.get(user.id);
    if (member.roles.cache.has(role.id)) return;

    try {
        // Add the role to the member
        await member.roles.add(role);
        console.log(`Added role ${roleName} to user ${user.tag}`);
    } catch (error) {
        console.error('Failed to add role:', error);
    }
});

// Event triggered when a reaction is removed from a message
client.on('messageReactionRemove', async (reaction, user) => {
    // Ignore reactions that are not on the roles message or from bots
    if (reaction.message.id !== rolesMessageID || user.bot) return;

    console.log(`Reaction removed: ${reaction.emoji.name} by ${user.tag}`);
    
    // Get the role name associated with the emoji
    const roleName = roles[reaction.emoji.name];
    if (!roleName) return;

    // Find the role in the guild by name
    const role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
    if (!role) return;

    // Find the member who removed the reaction
    const member = reaction.message.guild.members.cache.get(user.id);
    if (!member.roles.cache.has(role.id)) return;

    try {
        // Remove the role from the member
        await member.roles.remove(role);
        console.log(`Removed role ${roleName} from user ${user.tag}`);
    } catch (error) {
        console.error('Failed to remove role:', error);
    }
});

// Log in to Discord with your bot token
client.login('YOUR_BOT_TOKEN');
