import { resolve as resolvePath } from 'path'

import { cloneRepo } from './clone-repo'
import { installNodeModules } from './install-node-modules'
import { publishGithubArtifact } from './publish-github-artifact'
import { exec, spawn } from 'child_process'
import { testCode } from './test-code'
import { buildCode } from './build-code'
import { incrementVersion } from './increment-version'

export const continuousIntegration = ({
	branch,
	urlToClone,
	repoName,
	publish,
	githubUser,
	slack,
	logger
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		const locationOfRepo = resolvePath(process.env.DIRECTORY_TO_SAVE_REPOS)
		
		logger.info({
			msg: `Code for ${repoName} was recently merged into master`
		})

		const commonReqs = {
			repoName,
			exec,
			locationOfRepo,
			logger,
			spawn
		}

		logger.info({
			msg: `Starting a new build for ${repoName}`
		})
		
		cloneRepo({
			...commonReqs,
			urlToClone
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
		.then(() => incrementVersion({ ...commonReqs }))
		.then(({
			version
		}) => publishGithubArtifact({ ...commonReqs, version, locationOfRepo, githubUser }))
		.then(({
			version
		}) => {
			logger.info({
				msg: `Build for ${repoName} version ${version} finished successfully`
			})
			publish({
				channel: 'continuous delivery',
				data: {
					githubUser,
					repoName,
					version
				}
			})
		  return {}
		})
		.catch(err => {
			logger.info({
				method: 'continuousIntegration',
				msg: `Error occurred in Continuous Integration`,
				err
			})
			reject()
		})
	}

})
