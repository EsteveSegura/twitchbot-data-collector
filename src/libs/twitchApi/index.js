const axios = require('axios')

async function getChannels(pages=10,startPage=0,lang='en'){
    const streamsUrl = []
    for(let i = startPage; i < pages;i++) {
        console.log(`API TWITCH PAGE = ${i}`)
        const getSteramsPage = await axios.get(`https://api.twitch.tv/kraken/streams/?limit=100&language=${lang}&offset=${startPage}`,{
            headers:{
                'Client-ID':'l9expxe8ejc6rxjd80wzj4u9ohouo9',
                'Accept':'application/vnd.twitchtv.v5+json'
            }
        })
        streamsUrl.push(getSteramsPage.data.streams.map(el => el.channel.name))
    }
    return [].concat.apply([],streamsUrl)
}

module.exports = getChannels 