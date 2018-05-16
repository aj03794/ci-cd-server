import { resolve as resolvePath } from 'path'

export const installNodeModules = ({
	exec,
	data,
	repoName
}) => new Promise((resolve, reject) => {
	console.log('Installing node modules')
	const { locationOfRepo } = data
	exec(`npm install`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		if (err) {
			return reject({
				method: 'installNodeModules',
				data: {
					successful: false,
					err
				}
			})
		}
		return resolve({
			method: 'installNodeModules',
			data: {
				successful: true,
				err: null,
				locationOfRepo
			}
		})
	})
})
