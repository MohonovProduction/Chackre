const fs = require('fs')
const { Scenes: { WizardScene } } = require('telegraf')
const { close_scene } = require('./Keyboard')
const {DBConnect} = require("../models/DBConnect");

const Fuck = {}

const emoji = '😈,🤬,😡,😤,😠,👿,👺,👹,🦹‍♂️,!!!'

Fuck.add = new WizardScene(
	'addFuck',
	ctx => {
		ctx.editMessageText('Выскажи всё, что думаешь 🤬', close_scene)
		return ctx.wizard.next()
	},
	ctx => {
		if (!ctx?.message?.text) {
			if (ctx?.update?.callback_query?.data === 'cancel') {
				ctx.deleteMessage()
			} else {
				ctx.reply('Это не текст 😡')
			}

			return ctx.scene.leave()
		}

		DBConnect
			.add('fucks', ctx.message.text)
			.then( () => ctx.reply('Гнев запечатлён 😈'))
			.catch( err => {
				if (err === 'not unique') {
					ctx.reply('Так уже посылали 👿')
				} else {
					ctx.reply('Произошла ошибка 😞')
				}
			})

		return ctx.scene.leave();
	}
)

Fuck.get = function () {
	return new Promise((resolve, reject) => {
		DBConnect
			.get('fucks')
			.then( res => resolve(res))
			.catch( err => reject(err))
	})
}

module.exports = Fuck
