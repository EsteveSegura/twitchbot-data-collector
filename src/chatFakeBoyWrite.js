const Markov = require('./libs/markov/');
const fs = require('fs');
const chatLog = fs.readFileSync('./chatlog-en.txt').toString().split('\n')

let markovChain = new Markov()
markovChain.addStates(chatLog)
markovChain.train()
let generator = markovChain.magic();


for (let i = 0; i < 10; i++) {
    try {
        console.log(generator.next().value)
    } catch (error) {
        console.log(error)
    }
}

console.log("------------")
const titlegen = require('titlegen')

let gen = titlegen.create()
gen.feed(chatLog)
for (let i = 0; i < 1000000000; i++) {
    console.log(gen.next())
}