// import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import { existsSync, remove } from 'fs-extra'
import { cwd } from 'process'

export const cloneRepo = ({
	exec,
	urlToClone,
	repoName,
	logger
}) => new Promise((resolve, reject) => {

	const directoryToCloneRepo = process.env.DIRECTORY_TO_SAVE_REPOS || resolvePath(cwd(), 'downloads-from-github')
	const locationToCloneRepo = resolvePath(directoryToCloneRepo)
	doesCopyOfRedoExist({
		locationToCloneRepo,
		repoName,
		logger
	})
	.then(exists => {
		if (exists) {
			logger.info({
				msg: `${repoName} already exists`
			})
			return deleteOldRepo({ locationToCloneRepo, repoName, logger })
		}
		logger.info({
			msg: `${repoName} does not already exist`
		})
		return Promise.resolve()
	})
	.then(() => doRepoClone({ locationToCloneRepo, urlToClone, exec, logger, repoName }))
	.then(() => {
		resolve({
			data: {
				locationOfRepo: locationToCloneRepo
			}
		})
	})
	.catch(err => {
		logger.error({
			msg: `Something failed within cloneRepo for ${repoName}`,
			method: 'cloneRepo',
			err
		})
		return reject()
	})
})

// Deletes old cloned repo
export const deleteOldRepo = ({
	locationToCloneRepo,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Deleting old ${repoName}`
	})
	return remove(resolvePath(locationToCloneRepo, repoName), err => {
		if (err) {
			logger.error({
				msg: `Deleting old ${repoName} failed`,
				method: 'deleteOldApp',
				err
			})
			reject(err)
		}
		logger.info({
			msg: `Deleting old ${repoName} succeeded`
		})
		return resolve()
	})
})

// Returns true or false
const doesCopyOfRedoExist = ({
	locationToCloneRepo,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	const doesRepoExist = existsSync(resolvePath(locationToCloneRepo, repoName))
	logger.info({
		msg: `${repoName} exists: ${doesRepoExist}`
	})
	return resolve(doesRepoExist)
})


// Does the actual cloning of the repo
const doRepoClone = ({
	locationToCloneRepo,
	urlToClone,
	exec,
	logger,
	repoName
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Cloning ${repoName} from url: ${urlToClone}`
	})
	exec(`git clone ${urlToClone}`, { cwd: locationToCloneRepo }, (err, stdout, stderr) => {
		if (err) {
			logger.error({
				msg: `Cloning ${repoName} failed`,
				method: 'doRepoClone',
				err
			})
			return reject(err)
		}
		logger.info({
			msg: `Cloned ${repoName} successfully`
		})
		return resolve()
	})
})
