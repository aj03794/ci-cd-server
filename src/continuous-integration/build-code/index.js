import { resolve as resolvePath } from 'path'

export const buildCode = ({
	locationOfRepo,
	// data,
	repoName,
	exec
}) => new Promise((resolve, reject) => {
	console.log('testingCode')
	// const { locationOfRepo } = data
	exec(`npm run build`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		console.log('stdout', stdout)

		if (err) {
			return reject({
				method: 'buildCode',
				data: {
					err
				}
			})
		}
		return resolve({
			method: 'buildCode',
			data: {
				locationOfRepo
			}
		})
	})
})
