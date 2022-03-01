const { Scenes: { WizardScene } } = require('telegraf')
const { DBConnect } = require('./DBConnect')
require('dotenv').config()

const Admin = {}

Admin.id = process.env.ADMIN_ID

Admin.replyOnAudio = new WizardScene(
	'ReplyOnAudio',
	ctx => {
		ctx.reply('Пиши пожалуйста, будь человеком')
		return ctx.wizard.next()
	},
	ctx => {
		if (!ctx.message.voice) {
			ctx.reply('Так-то лучше')
		} else {
			ctx.reply('Невежа')
		}
		return ctx.scene.leave()
	}
)

Admin.addUser = function(ctx) {
	const user_id = ctx.message.from.id
	const username = ctx.message.from.username
	const firs_name = ctx.message.from.first_name

	console.log(user_id, username, firs_name)
	DBConnect.addUser(user_id, username, firs_name)
		.then( res => {
			ctx.reply(`Привет, ${firs_name})`)
			console.log(res)
		})
		.catch( err => console.log(err) )
}

Admin.addChat = function(ctx) {
	const chat_id = ctx.message.chat.id
	const title = ctx.message.chat.title
	DBConnect.addChat(chat_id, title)
		.then( res => {
			ctx.reply('Всем привки 🥰')
			console.log(res)
		})
		.catch( err => console.log(err) )
}

module.exports = { Admin }
