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
	if (ctx.message.new_chat_members) {
		const members = ctx.message.new_chat_members
		for (let member of members) {
			console.log(member)
			DBConnect.addUser(member.id, member.username, member.first_name)
				.then( res => {
					ctx.reply(`Привет, ${member.first_name})`)
					console.log(res)
				})
				.catch( err => console.log(err) )
		}
	}
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
