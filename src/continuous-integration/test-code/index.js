import { resolve as resolvePath } from 'path'

export const testCode = ({
	locationOfRepo,
	// data,
	repoName,
	exec
}) => new Promise((resolve, reject) => {
	console.log('testingCode')
	exec(`npm run test`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		console.log('stdout', stdout)
		if (err) {
			return reject({
				method: 'testCode',
				data: {
					err
				}
			})
		}
		return resolve({
			method: 'testCode',
			data: {
				locationOfRepo
			}
		})
	})
})
