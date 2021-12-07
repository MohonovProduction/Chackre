const fs = require('fs')
const { Scenes: { WizardScene } } = require('telegraf')
const { close_scene } = require('./Keyboard')
const { DBConnect } = require('../models/DBConnect')
const BDConnect = require("./Joke");

const Joke = {}

Joke.regular = /анек|шут/i

Joke.add = new WizardScene(
	'addJoke',
	ctx => {
		ctx.reply('Отправь мне анекдот', close_scene)
		return ctx.wizard.next()
	},
	ctx => {
		if (ctx?.message?.text) {
			DBConnect
				.add('jokes', ctx.message.text)
				.then( () => ctx.reply('Анекдот добавлен ☺️'))
				.catch( () => ctx.reply('Проиошла ошибка 😞'))
			return ctx.scene.leave();
		} else {
			return ctx.scene.leave();
		}
	},
)

Joke.get = function () {
	return new Promise( (resolve, reject) => {
		DBConnect
			.get('jokes')
			.then( res => resolve(res) )
			.catch( err => reject(err) )
	})
}

Joke.sendJoke = function () {}

module.exports = Joke
