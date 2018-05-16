import { resolve as resolvePath } from 'path'

export const testCode = ({
	data,
	repoName,
	exec
}) => new Promise((resolve, reject) => {
	console.log('testingCode')
	const { locationOfRepo } = data
	exec(`npm run test`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		console.log('stdout', stdout)
		// if (stdout === 'exit 0') {
		// 	console.log('FINISHED')
		// }
		// console.log('stderr', stderr)
		if (err) {
			return reject({
				method: 'testCode',
				data: {
					successful: false,
					err
				}
			})
		}
		return resolve({
			method: 'testCode',
			data: {
				successful: true,
				err: null,
				locationOfRepo
			}
		})
	})
})
