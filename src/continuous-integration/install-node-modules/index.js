import { resolve as resolvePath } from 'path'

export const installNodeModules = ({
	exec,
	locationOfRepo,
	repoName
}) => new Promise((resolve, reject) => {
	console.log('Installing node modules')
	// const { locationOfRepo } = data
	exec(`npm install`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		if (err) {
			return reject({
				method: 'installNodeModules',
				data: {
					err
				}
			})
		}
		return resolve({
			method: 'installNodeModules',
			data: {
				locationOfRepo
			}
		})
	})
})
