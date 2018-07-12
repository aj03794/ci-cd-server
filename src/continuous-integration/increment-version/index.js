import { exec, spawn } from 'child_process'
import { resolve as resolvePath } from 'path'
import { cwd } from 'process'
import { readFileSync } from 'fs'

export const incrementVersion = ({
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	const currentWorkingDir = resolvePath(cwd(), 'downloads-from-github', repoName)
	return doIncrementVersion({
		currentWorkingDir,
		logger,
		repoName
	})
	.catch(err => {
		return reject(err)
	})
	.then(() => getVersion({ currentWorkingDir, repoName, logger }))
	.then(({ version }) => resolve({ version }))
	.catch(err => {
		return reject({
			method: 'incrementVerson',
			data: {
				err
			}
		})
	})
})

const getVersion = ({
	currentWorkingDir,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	const version = JSON.parse(readFileSync(resolvePath(currentWorkingDir, 'package.json')))['version']
	logger.info({
		msg: `Current verison of ${repoName} is ${version}`
	})
	return resolve({ version })
})


const doIncrementVersion = ({
	currentWorkingDir,
	logger,
	repoName
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Incrementing version for ${repoName}`
	})
	const ls = spawn(`npm`, ['run', 'version-patch'], { cwd: currentWorkingDir });

	let err = null

	ls.stderr.on('data', (data) => {
	  console.log(`doIncrementVersion stderr: ${data}`)
	  err = null
	})

	ls.on('close', (code) => {
		if (code !== 0) {
			logger.error({
				method: `doIncrementVersion`,
				msg: `Incrementing version failed on ${repoName}`,
				err
			})
			return reject()
		}
		logger.info(`Incrementing version for ${repoName} succeeded with exit code ${code}`)
		resolve({})
	})
})
