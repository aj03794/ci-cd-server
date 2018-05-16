import { path as resolvePath } from 'path'

import { cloneRepo } from './clone-repo'
import { installNodeModules } from './install-node-modules'
import { publishGithubArtifact } from './publish-github-artifact'
import { exec } from 'child_process'
import { testCode } from './test-code'
import { buildCode } from './build-code'
import { incrementVersion } from './increment-version'

export const handleNewCode = ({
	branch,
	urlToClone,
	repoName,
	publish
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		const locationOfRepo = resolvePath(process.env.DIRECTORY_TO_SAVE_REPOS)
		console.log('locationOfRepo', locationOfRepo)
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

		.then(() => {
			return incrementVersion({})
		})
		.then(({
			data
		}) => publishGithubArtifact({ locationOfRepo }))
		.then(() => {
			const githubUser = 'aj03794'
			const repoName = 'raspberry-pi-camera'
			console.log('Alerting listening apps that new version of app is available')
			// emit to listening apps that a new version of the code is available for donwload
			publish()
	            .then(({ connect }) => connect())
	            .then(({ send }) => send({
	                channel: 'continuous delivery',
	                data: {
	                    githubUser,
											repoName
	                }
	            }))
	        return {}
		})
	}

})
