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
	console.log(2)
	return new Promise(resolve => {
		if (ctx.message.new_chat_members) {
			const members = ctx.message.new_chat_members
			for (let member of members) {
				addUser(ctx, member.id, member.username, member.first_name)
					.then( res => resolve(res) )
			}
		} else {
			const member = ctx.message.from
			addUser(ctx, member.id, member.username, member.first_name)
				.then( res => resolve(res) )
		}
	})
}

async function addUser(ctx, user_id, username, first_name) {
	console.log(3)
	console.log(user_id, username, first_name)
	return new Promise(resolve => {
		DBConnect.addUser(user_id, username, first_name)
			.then( res => {
				ctx.reply(`Привет, ${first_name})`)
				console.log(res)
				resolve(`Кто-то меня использует - @${username}`)
			})
			.catch( err => console.log(err, 'user already exist') )
	})
}

Admin.addChat = function(ctx) {
	const chat_id = ctx.message.chat.id
	const title = ctx.message.chat.title
	DBConnect.addChat(chat_id, title)
		.then( res => {
			ctx.reply('Всем привки 🥰')
			console.log(res)
		})
		.catch( err => console.log(err, 'chat already exist') )
}

Admin.mail = function(bot, ctx) {
	console.log(ctx.message.from.id, Admin.id)
	if (Admin.id == ctx.message.from.id) {
		const msg = ctx.message.text.replace('/mail ', '')
		DBConnect.select('chats')
			.then( res => {
				console.log(res)
				for (let row of res) {
					bot.telegram.sendMessage(row.chat_id, msg)
				}
			})
			.catch( err => bot.telegram.sendMessage(Admin.id, err, { parse_mode: 'HTML' }))
	}
}

module.exports = { Admin }
