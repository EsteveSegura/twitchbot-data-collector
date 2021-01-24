(async () => {
    require('dotenv').config()
    const fs = require('fs')
    const tmi = require('tmi.js');
    const terminal = require('./terminal');
    const getChannels = require('./libs/twitchApi');
    const dateStart = Date.now()
    let msgs = []
    let scopedMsgs = []

    const twitchChannels = await getChannels(terminal.page, terminal.offset, terminal.language);

    const client = new tmi.Client({
        options: { debug: terminal.debug, messagesLogLevel: 'info' },
        connection: { reconnect: true, secure: true },
        identity: {
            username: 'fasterchatter',
            password: process.env.TOKENIRC
        },
        channels: twitchChannels
    })

    client.connect()

    client.on('message', async (channel, tags, message, self) => {
        if (self) return;
        console.log(tags)
        if (message.toLocaleLowerCase().includes(terminal.searchterm)) {
            const msgFormatedCsv = `${channel},${tags.username},${message}`
            console.log(msgFormatedCsv)
            scopedMsgs.push(msgFormatedCsv)
        }
        msgs.push(message)
    })

    if (terminal.autoSave) {
        setInterval(() => {
            saveData();
        }, 1000 * 60 * terminal.time);
    }


    function saveData() {
        const dirs = fs.readdirSync(__dirname)
        fs.writeFileSync(`./output/${dateStart}_chatlog.txt`, msgs.join('\n'), 'utf8')
        fs.writeFileSync(`./output/${dateStart}_scopedChatLog.csv`, scopedMsgs.join('\n'), 'utf8')
    }

    process.on('SIGINT', () => {
        saveData();
        process.exit(0)
    })
})()