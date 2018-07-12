// const publishRelease = require('publish-release')
import publishRelease from 'publish-release'
import { resolve as resolvePath } from 'path'
import { readdir as readDir, moveSync } from 'fs-extra'
import zipdir from 'zip-dir'

export const publishGithubArtifact = ({
	version,
	locationOfRepo,
	githubUser,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Creating github release for ${repoName}`
	})
	return moveFolder({
		src: resolvePath(locationOfRepo, repoName, 'node_modules'),
		dest: resolvePath(locationOfRepo, repoName, 'dist', 'node_modules'),
		logger,
		repoName
	})
	.then(() => readDirectory({ locationOfRepo, repoName, logger })
	.then(({
		assetsLocation,
		files
	}) => zipDirectory({ assetsLocation, files, locationOfRepo, version, repoName, logger }))
	.then(({
		files
	}) => createOpts({ version, files, githubUser, repoName, logger }))
	.then(({
		opts
	}) => {
		return publishRelease(opts, (err, release) => {
			logger.info({
				msg: `Publishing ${repoName} with ${opts}`
			})
		  // `release`: object returned from github about the newly created release
			if (err) {
				logger.error({
					method: `publishRelease`,
					msg: `Error publishing ${repoName}`,
					err
				})
				console.log('err publishing release', err)
				return reject()
			}
			logger.info({
				msg: `${repoName} version ${version} release created successfully`
			})
			resolve({ version })
		})
	}))
})

export const readDirectory = ({
	locationOfRepo,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	const assetsLocation = resolvePath(
		locationOfRepo,
		repoName,
		'dist'
	)
	logger.info({
		msg: `Reading ${repoName} assets at ${assetsLocation}`
	})
	return readDir(assetsLocation, (err, files) => {
		if (err) {
			logger.error({
				method: `readDirectory`,
				msg: `Reading ${repoName} assets location failed`,
				err
			})
			return
		}
		logger.info({
			msg: `Successfully retrieved assets location for ${repoName}`
		})
		return resolve({
			assetsLocation,
			files
		})
	})
})

const zipDirectory = ({
	assetsLocation,
	files,
	locationOfRepo,
	version,
	repoName,
	logger
}) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Zipping ${assetsLocation}`
	})
	return zipdir(assetsLocation, { saveTo: resolvePath(assetsLocation, '../', `${repoName}-${version}.zip`) }, function (err, buffer) {
		if (err) {
			logger.info({
				method: `zipDirectory`,
				msg: `Failed zipping ${assetsLocation}`,
				err
			})
			return reject()
		}
		logger.info({
			msg: `Finished zipping ${assetsLocation}`
		})
		return resolve({
			assetsLocation,
			files: [
				resolvePath(assetsLocation, '../', `${repoName}-${version}.zip`)
			]
		})
	})
})

const createOpts = ({
	version,
	files,
	githubUser,
	repoName
}) => {
	return Promise.resolve({
		opts: {
		  token: process.env.GITHUB_OAUTH_TOKEN,
		  owner: githubUser,
		  repo: repoName,
		  tag: version,
		  name: `repoName`,
		  draft: false,
		  prerelease: false,
		  reuseRelease: true,
		  reuseDraftOnly: true,
		  skipAssetsCheck: false,
		  skipDuplicatedAssets: false,
		  editRelease: false,
		  deleteEmptyTag: false,
		  assets: files,
		  target_commitish: 'master'
		}
	})
}

export const moveFolder = ({ src, dest, logger, repoName }) => new Promise((resolve, reject) => {
	logger.info({
		msg: `Copying node modules for ${repoName} from ${src} to ${dest}`
	})
	try {
		moveSync(src, dest)
		logger.info({
			msg: `Finished copying node_modules for ${repoName}`
		})
		return resolve()
	}
	catch (e) {
		logger.error({
			method: `moveFolder`,
			msg: `Copying node_modules for ${repoName} failed`,
			err: e
		})
		return reject(e)
	}
	
})
