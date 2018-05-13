import { cloneRepo } from './clone-repo'
import { installNodeModules } from './install-node-modules'
import { publishGithubArtifact } from './publish-github-artifact'
import { exec } from 'child_process'
import { testCode } from './test-code'
import { buildCode } from './build-code'

export const handleNewCode = ({
	branch,
	urlToClone,
	repoName
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		console.log('This code was pushed to master')
		cloneRepo({
			exec,
			urlToClone,
			repoName
		})
		.then(({
			data
		}) => installNodeModules({ repoName, exec, data }))
		.then(({
			data
		}) => testCode({ repoName, exec, data }))
		.then(({
			data
		}) => buildCode({ repoName, exec, data }))
		.then(({
			data
		}) => publishGithubArtifact({ data }))
		.then(() => {
			console.log('Successful build')
			// resolve()

		})
	}

})
