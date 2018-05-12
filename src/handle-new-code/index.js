import { cloneRepo } from './clone-repo'
import { installNodeModules } from './install-node-modules'
import { exec } from 'child_process'

export const handleNewCode = ({
	branch,
	urlToClone,
	repoName
}) => new Promise((resolve, reject) => {
	if (branch === 'fake-branch') {
		console.log('This code was pushed to fake-branch')
		cloneRepo({
			exec,
			urlToClone
		})
		.then(({
			data
		}) => installNodeModules({ exec, data, repoName }))
		.then(console.log)
		.catch(console.log)
		// .then(() => testRepo)
		// .then(() => publish)
		// clone repo to `downloads-from-github`
		// run test
		// if test succeeds then publish a release (code should be a bundle preferably)
	}

})
