const Eval = {}

Eval.math = function(ctx) {
	console.log(ctx.message)
	const text = ctx.message.text.split(' ')
	const num1 = Number(text[1])
	const num2 = Number(text[3])
	if (text.length !== 4) return ctx.reply('> Не математическая операция\n_eval_', { parse_mode: 'Markdown' })

	const operation = text[2]

	switch(operation) {
		case '+': 
			answer(num1 + num2, text)
			break
		case '-':
			answer(num1 - num2, text)
			break
		case '*':
			answer(num1 * num2, text)
			break
		case '/':
			answer(num1 / num2, text)
			break
		case 'mod':
			answer(num1 % num2, text)
			break
		default:
			ctx.reply('> Не математическая операция\n_eval_', { parse_mode: 'Markdown' })
	}

	function answer (result, text) {
		const answer = `*> ${result}* \n_= ${text[1]} ${text[2]} ${text[3]} eval_`
		ctx.reply(answer, { parse_mode: 'Markdown' })
	}
}

module.exports = { Eval }