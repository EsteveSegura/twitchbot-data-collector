(async () => {
    require('dotenv').config()
    const fs = require('fs')
    const tmi = require('tmi.js');
    const terminal = require('./libs/terminal');
    const getChannels = require('./libs/twitchApi');
    const dateStart = Date.now()
    let allMsgFormatedCsv = ['timestamp,channel,username,subscriber,mod,message']
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
        if (terminal.searchterm) {
            if (message.toLocaleLowerCase().includes(terminal.searchterm)) {
                const msgFormatedCsv = `${channel},${tags.username},${message}`
                scopedMsgs.push(msgFormatedCsv)
            }
        }
        allMsgFormatedCsv.push(`${Date.now()},${channel.substring(1)},${tags.username},${tags.subscriber},${tags.mod},${message.replace(/,/g, "[,]")}`)
    })

    if (terminal.autoSave) {
        setInterval(() => {
            saveData();
        }, 1000 * 60 * terminal.time);
    }


    function saveData() {
        fs.writeFileSync(`./output/${dateStart}_chatlog.csv`, allMsgFormatedCsv.join('\n'), 'utf8')
        if (terminal.searchterm) {
            fs.writeFileSync(`./output/${dateStart}_scopedChatLog.csv`, scopedMsgs.join('\n'), 'utf8')
        }
    }

    process.on('SIGINT', () => {
        saveData();
        process.exit(0)
    })
})()