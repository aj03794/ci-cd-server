import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import { cwd } from 'process'

export const incrementVersion = ({
	repoName
}) => new Promise((resolve, reject) => {
	const currentWorkingDir = resolvePath(cwd(), 'downloads-from-github', repoName)
	console.log('currentWorkingDir', currentWorkingDir)
	return doIncrementVersion({
		currentWorkingDir
	})
	.then(() => getVersion({ currentWorkingDir }))
	.then(({ version }) => resolve({ version }))
})

const getVersion = ({
	currentWorkingDir
}) => new Promise((resolve, reject) => {
	console.log('Getting version')
	const version = require(`${currentWorkingDir}/package.json`)['version']
	console.log('Version', version)
	return resolve({ version })
})


const doIncrementVersion = ({
	currentWorkingDir
}) => new Promise((resolve, reject) => {
	console.log('Incrementing version')
	return exec(`npm run version-patch`,
		{
			cwd: currentWorkingDir
		},
		(err, stdout, stderr) => {
			if (err) {
				console.log('err in incrementingVersion', err)
				return
			}
			console.log('stdout', stdout)
			console.log('stderr', stderr)
			console.log('FINISHED INCREMENTING VERSION')
			resolve({})
		}
	)
})
