// import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import { existsSync, remove } from 'fs-extra'
import { cwd } from 'process'

export const cloneRepo = ({
	exec,
	urlToClone,
	repoName
}) => new Promise((resolve, reject) => {
	const directoryToCloneRepo = process.env.DIRECTORY_TO_SAVE_REPOS || resolvePath(cwd(), 'downloads-from-github')
	const locationToCloneRepo = resolvePath(directoryToCloneRepo)
	doesCopyOfRedoExist({
		locationToCloneRepo,
		repoName
	})
	.then(exists => {
		if (exists) {
			console.log('Repo already exists')
			return deleteOldRepo({ locationToCloneRepo, repoName })
		}
		console.log('Repo does not already exist')
		return Promise.resolve()
	})
	.then(() => doRepoClone({ locationToCloneRepo, urlToClone, exec }))
	.catch(err => console.log('err', err))
	.then(result => console.log('result', result))
	.then(() => {
		console.log('Finished cloning')
		resolve({
			data: {
				locationOfRepo: locationToCloneRepo
			}
		})
	})
})

// Deletes old cloned repo
export const deleteOldRepo = ({
	locationToCloneRepo,
	repoName
}) => new Promise((resolve, reject) => {
	console.log('Deleting old repo')
	return remove(resolvePath(locationToCloneRepo, repoName), err => {
		if (err) {
			return reject({
				method: 'deleteOldRepo',
				data: {
					successful: false,
					err
				}
			})
		}
		return resolve({
			method: 'deleteOldRepo',
			data: {
				successful: true,
				err: null
			}
		})
	})
})

// Returns true or false
const doesCopyOfRedoExist = ({
	locationToCloneRepo,
	repoName
}) => new Promise((resolve, reject) => {
	const doesRepoExist = existsSync(resolvePath(locationToCloneRepo, repoName))
	console.log('DOES doesRepoExist', doesRepoExist)
	return resolve(doesRepoExist)
})


// Does the actual cloning of the repo
const doRepoClone = ({
	locationToCloneRepo,
	urlToClone,
	exec
}) => new Promise((resolve, reject) => {
	console.log('doing cloning of repo')
	exec(`git clone ${urlToClone}`, { cwd: locationToCloneRepo }, (err, stdout, stderr) => {
		if (err) {
			return reject({
				method: 'cloneRepo',
				data: {
					successful: false,
					err
				}
			})
		}
		return resolve({
			method: 'cloneRepo',
			data: {
				successful: true,
				err: null,
				locationOfRepo: locationToCloneRepo
			}
		})
	})
})
