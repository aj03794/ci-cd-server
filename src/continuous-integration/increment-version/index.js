import { exec, spawn } from 'child_process'
import { resolve as resolvePath } from 'path'
import { cwd } from 'process'
import { readFileSync } from 'fs'

export const incrementVersion = ({
	repoName
}) => new Promise((resolve, reject) => {
	const currentWorkingDir = resolvePath(cwd(), 'downloads-from-github', repoName)
	console.log('currentWorkingDir', currentWorkingDir)
	return doIncrementVersion({
		currentWorkingDir
	})
	.catch(err => {
		return reject(err)
	})
	.then(() => getVersion({ currentWorkingDir }))
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
	currentWorkingDir
}) => new Promise((resolve, reject) => {
	console.log('Getting version')
	const version = JSON.parse(readFileSync(resolvePath(currentWorkingDir, 'package.json')))['version']
	return resolve({ version })
})


const doIncrementVersion = ({
	currentWorkingDir
}) => new Promise((resolve, reject) => {
	console.log('Incrementing version')

	const ls = spawn(`npm`, ['run', 'version-patch'], { cwd: currentWorkingDir });


	ls.stderr.on('data', (data) => {
	  console.log(`doIncrementVersion stderr: ${data}`)
	})

	ls.on('close', (code) => {
		if (code !== 0) {
				return reject({
					method: 'installNodeModules',
					data: {
						err
					}
				})
			}
	  console.log(`doIncrementVersion exited with code ${code}`);
		resolve({})
	})
})
