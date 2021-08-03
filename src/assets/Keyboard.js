const { Markup } = require('telegraf')

const Keyboard = {}

Keyboard.close_scene = Markup.inlineKeyboard(
	[Markup.button.callback('Отмена', 'cancel')]
)

module.exports = Keyboard