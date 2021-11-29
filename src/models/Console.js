const fs = require('fs')
const Console = {}

Console.tree = readDirs('./')

Console.treePosition

function readDirs(path) {
	const tree = {}

	files = fs.readdirSync(path)

	files = files.filter( el => {
		if (!((el.name === 'env.js') || (el.search(/^\./) > -1))) {
			return el
		} else { console.log(el) }
	})

	files.map( file => {
		fs.stat(`${path}/${file}`, (err, stat) => {
			console.log(`path: ${path}/${file}`)
			if (err) console.error(err)

			if (stat.isDirectory()) {
				console.log(`folder: ${file}`)

				const branch = { name: file, files: [] }

				branch.files = readDirs(`${path}/${file}`)
				tree[file] = branch
			} else {
				tree[file] = file
				console.log(`tree: ${tree}`)
			}
		})
	})

//	console.log(tree)
	return tree
}

Console.ls = function(ctx) {

}

module.exports = { Console }
