const fs = require('fs')
const { Scenes: { WizardScene } } = require('telegraf')
const { close_scene } = require('./Keyboard')

const Joke = {}

Joke.store = require('./store/joke-store')

Joke.add = new WizardScene(
	'addJoke',
	ctx => {
		ctx.reply('Отправь мне анекдот', close_scene)
		return ctx.wizard.next()
	},
	ctx => {
		if (ctx?.message?.text) {
			Joke.store[Joke.store.length] = ctx.message.text

			const data = 'module.exports = ' + JSON.stringify(Joke.store)
			fs.writeFile('store/joke-store.js', data, err => {
				let answer = (err) ? err : 'Анекдот добавлен ☺️'
				ctx.reply(answer)
			})
			return ctx.scene.leave();
		} else { 
			return ctx.scene.leave(); 
		}
	},
)

module.exports = Joke