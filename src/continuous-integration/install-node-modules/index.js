import { resolve as resolvePath } from 'path'

export const installNodeModules = ({
	exec,
	locationOfRepo,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Installing node_modules for ${repoName}`
	})
	exec(`npm install`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		if (err) {
			logger.error({
				method: `installNodeModules`,
				msg: `npm installed for ${repoName}`,
				err
			})
			return reject()
		}

		logger.info({
			msg: `Installing node_modules successful for ${repoName}`
		})

		return resolve({
			data: {
				locationOfRepo
			}
		})
	})
})
