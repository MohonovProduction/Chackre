const { Telegraf, session, Scenes: { WizardScene, Stage }, Markup } = require('telegraf')
const fs = require('fs')
const { Config } = require('./BotConfig')
const { Admin } = require('./src/models/Admin')
const { Eval } = require('./src/models/Eval')
const { Console } = require('./src/models/Console')
const Fuck = require('./src/assets/Fuck')
const Joke = require('./src/assets/Joke')
const Gachi = require('./src/assets/Gachi')
require('dotenv').config()

//Scenes
const stage = new Stage();

stage.register(Admin.replyOnAudio)

stage.register(Joke.add)
stage.register(Fuck.add)
stage.register(Gachi.add)

//Create
let BOT_TOKEN = process.env.TOKEN
console.log(BOT_TOKEN)
const bot = new Telegraf(BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())
bot.telegram.setMyCommands(Config.commands);

//Main
bot.start(ctx => ctx.reply('start'))
bot.help(ctx => ctx.reply('help'))

bot.command('whatsnew', ctx => ctx.reply(Config.whatsNew))

bot.command('love', ctx => ctx.reply('Люблю, целую, обнимаю ❤'))
bot.command('fuck', ctx => Fuck.get().then( res => ctx.reply(res) ))
//bot.command('scan', ctx => ctx.reply(Admin.scan(ctx), { parse_mode: 'Markdown' }))

bot.command('eval', ctx => Eval.math(ctx))
//bot.command('ls', ctx => Console.ls(ctx))
//bot.command('tree', ctx => Console.tree(ctx))

const r = () => { return Math.random() < 0.2 }

bot.on('voice', ctx => {
	if (r()) ctx.scene.enter('ReplyOnAudio')
})

bot.on('video_note', ctx => {
	if (r()) ctx.reply('Вижу котика 😼')
})

bot.hears(Joke.regular, ctx => {
	if (r()) Joke.get().then( res => ctx.reply(res))
})
bot.hears(Gachi.regular, ctx => {
	if (r()) Gachi.get().then( res => ctx.reply(res))
})

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
