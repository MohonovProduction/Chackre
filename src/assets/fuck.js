const { Scenes: { WizardScene } } = require('telegraf') 
const fs = require('fs')
const { close_scene } = require('./Keyboard')

const Fuck = {}

Fuck.store = require('./store/fuck-store')

const emoji = '😈,🤬,😡,😤,😠,👿,👺,👹,🦹‍♂️,!!!'

Fuck.add = new WizardScene(
	'addFuck',
	ctx => {
		ctx.reply('Выскажи всё, что думаешь 🤬', close_scene)
		return ctx.wizard.next()
	},
	ctx => {
		const msg = 'fuck check'
		if (!ctx?.message?.text) return ctx.scene.leave()
		console.log(msg, false)
		for (el of Fuck.store) {
			if (el === ctx.message.text) {
				ctx.reply('Так уже посылали 😈')
				return ctx.scene.leave() 
				break
			} 
		}
		console.log(msg, false)

		Fuck.store[Fuck.store.length] = ctx.message.text + ' ' + getRandomEl(emoji.split(','))
		const data = 'module.exports = ' + JSON.stringify(Fuck.store)

		fs.writeFile('store/fuck-store.js', data, err => {
			let answer = (err) ? err : 'Гнев запечатлён 😈'
			ctx.reply(answer)
		})
		return ctx.scene.leave();
	}
)

function getRandomEl(arr) {
	const id = Math.floor(Math.random() * arr.length)
	return arr[id]
}

module.exports = Fuck