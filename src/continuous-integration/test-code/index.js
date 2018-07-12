import { resolve as resolvePath } from 'path'

export const testCode = ({
	locationOfRepo,
	repoName,
	exec,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Testing code for ${repoName}`
	})
	exec(`npm run test`, { cwd: resolvePath(locationOfRepo, repoName) }, (err, stdout, stderr) => {
		if (err) {
			logger.error({
				method: `testCode`,
				msg: `Npm run test failed for ${repoName}`,
				err
			})
			return reject()
		}
		logger.info({
			msg: `All tests passed for ${repoName}`
		})
		return resolve({
			data: {
				locationOfRepo
			}
		})
	})
})
