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
	slack
}) => new Promise((resolve, reject) => {
	if (branch === 'master') {
		const locationOfRepo = resolvePath(process.env.DIRECTORY_TO_SAVE_REPOS)
		console.log('locationOfRepo', locationOfRepo)
		console.log('Code was recently merged into master')
		const commonReqs = {
			repoName,
			exec,
			locationOfRepo,
			spawn
		}
		slack({
			slackMsg: {
				repo: repoName,
				step: 'cloning repo'
			}
		})
		cloneRepo({
			exec,
			urlToClone,
			repoName
		})
		.then(({
			data
		}) => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'installing node_modules'
				}
			})
			return installNodeModules({ ...commonReqs })
		})
		.then(({
			data
		}) => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'testing code'
				}
			})
			return testCode({ ...commonReqs })
		})
		.then(({
			data
		}) => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'building code'
				}
			})
			return buildCode({ ...commonReqs })
		})
		.then(() => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'incrementing version'
				}
			})
			return incrementVersion({ ...commonReqs })
		})
		.then(({
			version
		}) => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'publishing github artifact'
				}
			})
			return publishGithubArtifact({ repoName, version, locationOfRepo, githubUser })
		})
		.then(({
			version
		}) => {
			slack({
				slackMsg: {
					repo: repoName,
					step: 'finished successfully'
				}
			})
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
		.catch(err => {
			console.log('ERROR OCCURRED', err)
			slack({
				slackMsg: {
					repo: repoName,
					step: 'build failed',
					error: err
				}
			})
			reject()
		})
	}

})
