const fs = require('fs')
const Console = {}

Console.tree = readDirs('./')

function readDirs(path) {
	fs.readdir(path, (err, files) =>  {
		if (err) console.log(err)
		
		//
		files.map( (el, id) => {
			if (el === 'env.js') {
				console.log(el)
			}
			if (el.search(/^\./) > -1) {
				console.log(el)
			}
		})
		//

		files = files.filter(function(el) { 
			if (!((el.name === 'env.js') || (el.search(/^\./) > -1))) {
				return el
			}
		})

		console.log(files)
		return files
	})
}

Console.ls = function(ctx) {

}

module.exports = { Console }