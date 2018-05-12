import { cloneRepo } from './clone-repo'

export const handleNewCode = ({
	branch,
	urlToClone
}) => new Promise((resolve, reject) => {
	if (branch === 'fake-branch') {
		console.log('This code was pushed to fake-branch')
		cloneRepo({
			urlToClone
		})
		.then(console.log)
		.catch(console.log)
		// .then(() => testRepo)
		// .then(() => publish)
		// clone repo to `downloads-from-github`
		// run test
		// if test succeeds then publish a release (code should be a bundle preferably)
	}

})
