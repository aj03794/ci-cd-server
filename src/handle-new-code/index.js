export const handleNewCode = ({
	branch,
	urlToClone
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		console.log('This code was pushed to master')
		// clone repo to `downloads-from-github`
		// run test
		// if test succeeds then publish a release (code should be a bundle preferably)
	}

})
