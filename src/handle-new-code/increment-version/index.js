import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import process from 'process'

export const incrementVersion = ({
	// exec
}) => new Promise((resolve, reject) => {
	const cwd = resolvePath(__dirname, '../../../', 'downloads-from-github', 'raspberry-pi-camera')
	console.log('CWD', cwd)
	return doIncrementVersion({
		cwd
	})
	.then(() => getVersion({ cwd }))
	.then(({ version }) => resolve({ version }))
})

const getVersion = ({
	cwd
}) => new Promise((resolve, reject) => {
	console.log('Getting version')
	const version = require(`${cwd}/package.json`)['version']
	console.log('Version', version)
	console.log('CWD FROM PROCESS.CWD', process.cwd())
	return resolve({ version })
})


const doIncrementVersion = ({
	cwd
}) => new Promise((resolve, reject) => {
	console.log('Incrementing version')
	return exec(`npm run version-patch`,
		{
			cwd
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
