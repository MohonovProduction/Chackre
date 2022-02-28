const Eval = {}

Eval.do = function(ctx) {
	const command = ctx.message.text.replace('/eval', '')
	if (command.search(/mamky/i) > -1) { ctx.reply('tvoyou') }
	else {
		let result = ''
		try {
			result = eval(command)
		} catch {
			result = '<b>Uncaught ReferenceError</b>\n(anonymous):&lt;nepovezlo;nepovezlo&gt;'
		}
		result =
			`&gt; <code>${result}</code>\n` +
			`&lt;· <i>eval</i>`
		ctx.reply(result, { parse_mode: 'HTML' })
	}
}

module.exports = { Eval }
