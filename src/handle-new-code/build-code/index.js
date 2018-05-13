import { resolve as resolvePath } from 'path'

export const buildCode = ({
	data,
	repoName,
	exec
}) => new Promise((resolve, reject) => {
	console.log('testingCode')
	const { locationOfRepo } = data
	exec(`npm run build`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		console.log('stdout', stdout)
		// if (stdout === 'exit 0') {
		// 	console.log('FINISHED')
		// }
		// console.log('stderr', stderr)
		if (err) {
			return reject({
				method: 'buildCode',
				data: {
					successful: false,
					err
				}
			})
		}
		return resolve({
			method: 'buildCode',
			data: {
				successful: true,
				err: null,
				locationOfRepo
			}
		})
	})
})
