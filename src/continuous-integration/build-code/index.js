import { resolve as resolvePath } from 'path'

export const buildCode = ({
	locationOfRepo,
	// data,
	repoName,
	exec,
	spawn
}) => new Promise((resolve, reject) => {
	console.log('testingCode')

	console.log('buildingCode')
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
				return reject({
					method: 'buildCode',
					data: {
						err
					}
				})
			}
	  console.log(`buildCode exited with code ${code}`);
		resolve({})
	})
})
