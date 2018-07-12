import { resolve as resolvePath } from 'path'

export const buildCode = ({
	locationOfRepo,
	repoName,
	spawn,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Building code for ${repoName}`
	})
	const ls = spawn(
		`npm`,
		['run', 'build'],
		{ cwd: resolvePath(locationOfRepo, repoName) }
	)

	let err = null

	ls.stderr.on('data', (data) => {
	  console.log(`buildCode stderr: ${data}`)
	  err = data
	})

	ls.on('close', (code) => {
		if (code !== 0) {
			logger.error({
				method: `buildCode`,
				msg: `Building code for ${repoName} failed`
			})
			return reject()
		}
		logger.info({
			msg: `Building code for ${repoName} succeeded with exit code ${code}`
		})
		resolve()
	})
})
