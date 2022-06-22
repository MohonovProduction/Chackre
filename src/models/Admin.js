const { Scenes: { WizardScene } } = require('telegraf')
const { DBConnect } = require('./DBConnect')
const { Config } = require('../../bot_config')
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

Admin.addUser = function(ctx, bot) {
	if (ctx.message.new_chat_members) {
		const members = ctx.message.new_chat_members
		for (let member of members) {
			addUser(ctx, member.id, member.username, member.first_name)
				.then( () => {
					bot.telegram.sendMessage(Admin.id, `Меня кто-то использует: @${member.username}`)
				})
		}
	} else {
		const member = ctx.message.from
		addUser(ctx, member.id, member.username, member.first_name)
			.then( () => {
				bot.telegram.sendMessage(Admin.id, `Меня кто-то использует: @${member.username}`)
			})
	}
}

async function addUser(ctx, user_id, username, first_name) {
	return new Promise(resolve => {
		DBConnect.addUser(user_id, username, first_name)
			.then( res => {
				ctx.reply(`Привет, ${first_name})`)
				resolve(`Кто-то меня использует - @${username}`)
			})
			.catch( err => console.log(err, 'user already exist') )
	})
}

Admin.addChat = function(ctx, bot) {
	const chat_id = ctx.message.chat.id
	const title = ctx.message.chat.title
	DBConnect.addChat(chat_id, title)
		.then( res => {
			ctx.reply('Всем привки 🥰')
			bot.telegram.sendMessage(Admin.id, `Меня добавили в чат: ${title}`)
		})
		.catch( err => console.log(err) )
}

Admin.select = function(ctx) {
	if (ctx.message.from.id == Admin.id) {
		const table = ctx.message.text.replace('/select ', '')
		DBConnect.select(table)
			.then( res => {
				let formatted = ''
				for (let row of res.rows) {
					for (let item in row) {
						formatted += `${item}: ${row[item]}  `
					}
					formatted += '\n\n'
				}
				ctx.reply(formatted)
			})
			.catch( err => ctx.reply(`<code>${err}</code>`, { parse_mode: 'HTML' }) )
	}
}

Admin.mail = function(bot, ctx) {
	if (Admin.id == ctx.message.from.id) {
		let msg = ctx.message.text.replace('/mail ', '')
		if (msg === 'upd') msg = Config.whatsNew
		DBConnect.select('chats')
			.then( res => {
				console.log(res)
				const rows = res.rows
				for (let row of rows) {
					bot.telegram.sendMessage(row.chat_id, msg)
				}
			})
			.catch( err => bot.telegram.sendMessage(Admin.id, err, { parse_mode: 'HTML' }))
	}
}



module.exports = { Admin }
