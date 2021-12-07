const fs = require('fs')
const { Scenes: { WizardScene } } = require('telegraf')
const { close_scene } = require('./Keyboard')
const {DBConnect} = require("../models/DBConnect");

const Gachi = {}

Gachi.regular = /гачи|ass|анал|300|eб|мастер|master|slave/i

Gachi.add = new WizardScene(
	'addGachi',
	ctx => {
		ctx.editMessageText('♂ Вставь ссылку на новый гачи ремикс ♂', close_scene)
		ctx.wizard.next()
	},
	ctx => {
		if (!ctx?.message?.text) {
			if (ctx?.update?.callback_query?.data === 'cancel') {
				ctx.deleteMessage()
			} else {
				ctx.reply('Это не ссылка 😡')
			}
			return ctx.scene.leave()
		}
		if (!ctx.message.text.match(/http/) && !ctx.message.text.match(/:\/\//)) {
			ctx.reply('Это не ссылка 😡')
			return ctx.scene.leave()
		}

		DBConnect
			.add('gachies', ctx.message.text)
			.then( () => ctx.reply('Гачи добавлено 😏'))
			.catch( err => {
				if (err === 'not unique') {
					ctx.reply('Такая ссылка уже есть 😉')
				} else {
					ctx.reply('Произошла ошибка 😞')
				}
			})
			return ctx.scene.leave()
	}
)

Gachi.get = function () {
	return new Promise((resolve, reject) => {
		DBConnect
			.get('gachies')
			.then( res => resolve(res) )
			.catch( err => reject(err) )
	})
}
module.exports = Gachi
