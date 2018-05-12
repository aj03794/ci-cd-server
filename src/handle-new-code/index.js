import { cloneRepo } from './clone-repo'
import { installNodeModules } from './install-node-modules'
import { exec } from 'child_process'
import { testCode } from './test-code'

export const handleNewCode = ({
	branch,
	urlToClone,
	repoName
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		console.log('This code was pushed to fake-branch')
		cloneRepo({
			exec,
			urlToClone,
			repoName
		})
		.then(({
			data
		}) => installNodeModules({ exec, data, repoName }))
		.then(({
			data
		}) => testCode({ repoName, exec, data }))
		.then(() => {
			console.log('Successful build')
			resolve()
		})
	}

})
