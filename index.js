const { Telegraf, session, Scenes: { WizardScene, Stage }, Markup } = require('telegraf')
const fs = require('fs')
const ASSETS_URL = 'src/assets/'
const { Config } = require('./BotConfig')
const { Admin } = require('./src/models/Admin')
const Fuck = require('./' + ASSETS_URL + 'Fuck')
const Joke = require('./' + ASSETS_URL + 'Joke')
const Gachi = require('./' + ASSETS_URL + 'Gachi')

//Scenes
const stage = new Stage();

stage.register(Joke.add)
stage.register(Fuck.add)
stage.register(Gachi.add)

//Create
let BOT_TOKEN = require('./env.js')
console.log(BOT_TOKEN)
const bot = new Telegraf(BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())
bot.telegram.setMyCommands(Config.commands);

//Main
bot.start(ctx => ctx.reply('start'))
bot.help(ctx => ctx.reply('help'))

const whatsNew = 'меня отрефакторили и понизели чувствительность к гачи фразам 😏'
bot.command('whatsnew', ctx => ctx.reply(whatsNew))

bot.command('love', ctx => ctx.reply('Люблю, целую, обнимаю ❤'))
bot.command('fuck', ctx => ctx.reply(getRandomEl(Fuck.store)))
//bot.command('scan', ctx => ctx.reply(Admin.scan(ctx), { parse_mode: 'Markdown' }))
bot.on('voice', ctx => ctx.reply('Пиши пожалуйста, будь человеком'))
bot.on('video_note', ctx => ctx.reply('Вижу котика 😼'))

const jokeKey = /анек/i 
bot.hears(jokeKey, ctx => ctx.reply(getRandomEl(Joke.store)))

const gachiKey = /гачи|фистинг|жоп|яйц|анал|фингер|драть|ебe/i
bot.hears(gachiKey, ctx => ctx.reply(getRandomEl(Gachi.store)))

function getRandomEl(arr) {
	const id = Math.floor(Math.random() * arr.length)
	return arr[id]
}

bot.command('add', (ctx) => {
	const inline_keyboard = Markup.inlineKeyboard([
		[ Markup.button.callback('Анекдот', 'joke') ],
		[ Markup.button.callback('Гачи ремикс', 'gachi') ],
		[ Markup.button.callback('Оскорбление', 'fuck') ]
	])

	ctx.reply('Что добавить?', inline_keyboard)
})

bot.action('joke', ctx => ctx.scene.enter('addJoke'))
bot.action('gachi', ctx => ctx.scene.enter('addGachi'))
bot.action('fuck', ctx => ctx.scene.enter('addFuck'))

bot.action('cancel', ctx => { ctx.reply('операция отменена'); ctx.scene.leave() })

bot.launch()
