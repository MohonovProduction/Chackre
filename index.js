const { Telegraf, session, Scenes: { WizardScene, Stage }, Markup } = require('telegraf')
const fs = require('fs')
const { Config } = require('./BotConfig')
const jokes = require('./assets/jokes')
const gachies = require('./assets/gachi')
const radio = []
fs.readdir('./assets/radio', (err, files) => {
	if (err) console.error(err)
	files.map(el => radio.push(el))
})

//Scenes
const close_scene = Markup.inlineKeyboard(
	[Markup.button.callback('Отмена', 'cancel')]
)

const addJoke = new WizardScene(
	'addJoke',
	ctx => {
		ctx.reply('Отправь мне анекдот', close_scene)
		return ctx.wizard.next()
	},
	ctx => {
		if (ctx?.message?.text) {
			console.log(ctx.message.text)
			jokes[jokes.length] = ctx.message.text
			const data = 'module.exports = ' + JSON.stringify(jokes)
			console.log(data)
			fs.writeFile('assets/jokes.js', data, err => {
				let answer = (err) ? err : 'Анекдот добавлен ☺️'
				ctx.reply(answer)
			})
			return ctx.scene.leave();
		} else { 
			return ctx.scene.leave(); 
		}
	},
)

const addGachi = new WizardScene(
	'addGachi',
	ctx => {
		ctx.reply('♂ Вставь ссылку на новый гачи ремикс ♂', close_scene)
		ctx.wizard.next()
	},
	ctx => {
		if (ctx?.message?.text) {
			if (ctx.message.text.match(/https:/)) {

				gachies[gachies.length] = ctx.message.text
				const data = 'module.exports = ' + JSON.stringify(gachies)

				fs.writeFile('assets/gachi.js', data, err => {
					let answer = (err) ? err : 'Гачи добавлено 😏'
					ctx.reply(answer)
				})
			return ctx.scene.leave();
			} else {
				ctx.reply('Это не ссылка');
				ctx.scene.leave()
			}
		} else {
			return ctx.scene.leave()
		}
	}
)

const stage = new Stage();

stage.register(addJoke)
stage.register(addGachi)

//Create
const bot = new Telegraf(Config.token)
bot.use(session())
bot.use(stage.middleware())
bot.telegram.setMyCommands(Config.commands);
//Main
bot.start((ctx) => ctx.reply('start'))
bot.help((ctx) => ctx.reply('help'))

bot.command('love', (ctx) => ctx.reply('Люблю, целую, обнимаю ❤'))
bot.command('fuck', (ctx) => ctx.reply('Пошёл нахуй!'))

const jokeKey = /анек/i 
bot.hears(jokeKey, (ctx) => ctx.reply(getRandomEl(jokes)))

const gachiKey = /гачи|фистинг|жоп|яйц|анал|фингер|драть|еб/i
bot.hears(gachiKey, (ctx) => ctx.reply(getRandomEl(gachies)))

function getRandomEl(arr) {
	const id = Math.floor(Math.random() * arr.length)
	return arr[id]
}

bot.command('add', (ctx) => {
	const inline_keyboard = Markup.inlineKeyboard([
		[ Markup.button.callback('Анекдот', 'joke') ],
		[ Markup.button.callback('Гачи ремикс', 'gachi') ],
		[ Markup.button.callback('Оскарбление', 'fuck') ]
	])

	ctx.reply('Что добавить?', inline_keyboard)
})

bot.action('joke', ctx => ctx.scene.enter('addJoke'))
bot.action('gachi', ctx => ctx.scene.enter('addGachi'))

bot.action('cancel', ctx => { ctx.reply('операция отменена'); ctx.scene.leave() })

bot.launch()