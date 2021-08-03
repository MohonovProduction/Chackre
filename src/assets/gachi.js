const fs = require('fs')
const { Scenes: { WizardScene } } = require('telegraf')
const { close_scene } = require('./Keyboard')

const Gachi = {}

Gachi.store = require('./store/gachi-store')

Gachi.add = new WizardScene(
	'addGachi',
	ctx => {
		ctx.reply('♂ Вставь ссылку на новый гачи ремикс ♂', close_scene)
		ctx.wizard.next()
	},
	ctx => {
		const msg = 'check gachi'
		if (!ctx?.message?.text) return ctx.scene.leave()
		console.log(msg, false)
		if (!ctx.message.text.match(/https:/)) { 
			ctx.reply('Это не ссылка')
			return ctx.scene.leave()
		}
		console.log(msg, false)
		for (el of Gachi.store) {
			if (el === ctx.message.text) {
				ctx.reply('такое видео уже есть')
				return ctx.scene.leave() 
				break
			} 
		}
		console.log(msg, false)

		Gachi.store[Gachi.store.length] = ctx.message.text
		const data = 'module.exports = ' + JSON.stringify(Gachi.store)

		fs.writeFile('store/gachi-store.js', data, err => {
			let answer = (err) ? err : 'Гачи добавлено 😏'
			ctx.reply(answer)
		})
		return ctx.scene.leave();
	}
)

module.exports = Gachi