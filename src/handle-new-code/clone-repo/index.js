// import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import clone from 'git-clone'

export const cloneRepo = ({
	urlToClone
}) => new Promise((resolve, reject) => {
	// clone url to downloads-from-github
	console.log('urlToClone', urlToClone)
	const directoryToCloneRepo = process.env.DIRECTORY_TO_SAVE_REPOS || resolvePath(__dirname, '../../../', 'downloads-from-github')
	const locationToCloneRepo = resolvePath(directoryToCloneRepo)
	console.log('locationToCloneRepo', locationToCloneRepo)
	// exec(`git clone ${urlToClone}`, { cwd: resolvePath(__dirname) }, (err, stdout, stderr) => {
		// if (err) {
		// 	return reject({
		// 		method: 'cloneRepo',
		// 		data: {
		// 			successful: false,
		// 			err
		// 		}
		// 	})
		// }
		// return resolve({
		// 	method: 'cloneRepo',
		// 	data: {
		// 		successful: true,
		// 		err: null
		// 	}
		// })
		// if (err) {
		// 	console.log('err', err)
		// }
		// console.log('stdout', stdout)
		// console.log('stderr', stderr)
	// })
	// clone(urlToClone, locationToCloneRepo, err => {
	// 	if (err) {
	// 		console.log('err', err)
	// 		return
	// 	}
	// 	console.log('success')
	// })
})
