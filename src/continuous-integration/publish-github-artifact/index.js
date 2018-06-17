// const publishRelease = require('publish-release')
import publishRelease from 'publish-release'
import { resolve as resolvePath } from 'path'
import { readdir as readDir, moveSync } from 'fs-extra'
import zipdir from 'zip-dir'

export const publishGithubArtifact = ({
	version,
	locationOfRepo,
	githubUser,
	repoName
}) => new Promise((resolve, reject) => {
	console.log('Creating github release')
	return moveFolder({
		src: resolvePath(locationOfRepo, repoName, 'node_modules'),
		dest: resolvePath(locationOfRepo, repoName, 'dist', 'node_modules')
	})
	.then(() => readDirectory({ locationOfRepo, repoName })
	.then(({
		assetsLocation,
		files
	}) => zipDirectory({ assetsLocation, files, locationOfRepo, version, repoName }))
	.then(({
		files
	}) => createOpts({ version, files, githubUser, repoName }))
	.then(({
		opts
	}) => {
		return publishRelease(opts, (err, release) => {
			console.log('Publishing release')
		  // `release`: object returned from github about the newly created release
			if (err) {
				console.log('err publishing release', err)
				return reject({
					method: 'publishRelease',
					data: {
						successful: false,
						err
					}
				})
			}
			console.log('RELEASE CREATED')
			resolve({ version })
		})
	}))
})

export const readDirectory = ({
	locationOfRepo,
	repoName
}) => new Promise((resolve, reject) => {
	const assetsLocation = resolvePath(
		locationOfRepo,
		repoName,
		'dist'
	)
	console.log('assetsLocation', assetsLocation)
	return readDir(assetsLocation, (err, files) => {
		if (err) {
			console.log('readDir error', err)
			return
		}
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
	repoName
}) => new Promise((resolve, reject) => {
	console.log('ASSETSLOCATION', assetsLocation)
	return zipdir(assetsLocation, { saveTo: resolvePath(assetsLocation, '../', `${repoName}-${version}.zip`) }, function (err, buffer) {
		if (err) {
			console.log('zipDirectory err', err)
			return
		}
		console.log('Finishing zipping directory')
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

export const moveFolder = ({ src, dest, assetsLocation, files }) => new Promise((resolve, reject) => {
	console.log('copying node_modules')
	console.log('src', src)
	console.log('dest', dest)
	moveSync(src, dest)
	return resolve({
		assetsLocation,
		files
	})
})
