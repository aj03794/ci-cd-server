import { resolve as resolvePath } from 'path'

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
	publish,
	githubUser
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		const locationOfRepo = resolvePath(process.env.DIRECTORY_TO_SAVE_REPOS)
		console.log('locationOfRepo', locationOfRepo)
		console.log('Code was recently merged into master')
		const commonReqs = {
			repoName,
			exec,
			locationOfRepo
		}
		cloneRepo({
			exec,
			urlToClone,
			repoName
		})
		.then(({
			data
		}) => installNodeModules({ ...commonReqs }))
		.then(({
			data
		}) => testCode({ ...commonReqs }))
		.then(({
			data
		}) => buildCode({ ...commonReqs }))
		.then(() => {
			return incrementVersion({ ...commonReqs })
		})
		.then(({
			version
		}) => publishGithubArtifact({ repoName, version, locationOfRepo, githubUser }))
		.then(({
			version
		}) => {
			console.log('Alerting listening apps that new version of app is available')
			console.log('githubUser', githubUser)
			console.log('repoName', repoName)
			console.log('version', version)
			// emit to listening apps that a new version of the code is available for donwload
			publish()
	      .then(({ connect }) => connect())
	      .then(({ send }) => send({
	          channel: 'continuous delivery',
	          data: {
				  githubUser,
				  repoName,
				  version
	          }
	      }))
	     return {}
		})
	}

})
