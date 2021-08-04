const Admin = {}

Admin.scan = function(ctx) {

	let chat = JSON.stringify(ctx.message.chat)
	console.log(chat)
	chat = '_User data:_ \n' + chat + '\n Backend output \n [/console.log()](/console)'
	chat = chat.split(/{/).join('{\n').split(/}/).join('\n}').split(/,/).join(',\n').split(/:/).join(': ')

	let user = JSON.stringify(ctx.message.from)
	console.log(user)
	user = '_Chat data:_ \n' + user + '\n Backend output \n [/console.log()](/console)'
	user = user.split(/{/).join('{\n').split(/}/).join('\n}').split(/,/).join(',\n').split(/:/).join(': ')

	return user + ' \n\n ' + chat
}

Admin.pinMessage = function(ctx) {
	chatId = ctx.message.from.id
	msgId = ctx.message.message_id

	if (ctx.message.text.match(/^!!!/)) {
		ctx.telegram.pinChatMessage(chatId, msgId, { disable_notification: false })
	} else {
		ctx.telegram.pinChatMessage(chatId, msgId, { disable_notification: true })
	}

}

module.exports = { Admin }