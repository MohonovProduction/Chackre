const { Scenes: { WizardScene } } = require('telegraf')
require('dotenv').config()

const Admin = {}

Admin.id = process.env.ADMIN_ID

Admin.pinMessage = function(ctx) {
	console.log(ctx.message)

	chatId = ctx.chat.id
	msgId = ctx.message.message_id

	if (ctx.message.text.match(/^!!!/)) {
		ctx.telegram.pinChatMessage(chatId, msgId, { disable_notification: false })
	} else {
		ctx.telegram.pinChatMessage(chatId, msgId, { disable_notification: true })
	}

}

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

module.exports = { Admin }
