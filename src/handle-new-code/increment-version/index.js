import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'

export const incrementVersion = ({

}) => new Promise((resolve, reject) => {
	const cwd = resolvePath(__dirname, '../../../', 'downloads-from-github', 'raspberry-pi-camera')
	console.log('CWD', cwd)
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
			resolve()
		}
	)
})
