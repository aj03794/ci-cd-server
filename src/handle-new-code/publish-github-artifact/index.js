// const publishRelease = require('publish-release')
import publishRelease from 'publish-release'
import { resolve as resolvePath } from 'path'
import { readdir as readDir, moveSync } from 'fs-extra'
import zipdir from 'zip-dir'

export const publishGithubArtifact = ({
	version,
	locationOfRepo,
	githubUser
}) => new Promise((resolve, reject) => {
	console.log('Creating github release')
	// const { locationOfRepo } = data
	console.log('locationOfRepo', locationOfRepo)
	console.log('---->', resolvePath(locationOfRepo, 'raspberry-pi-camera', 'node_modules'))
	console.log('====>', resolvePath(locationOfRepo, 'raspberry-pi-camera', 'dist'))
	const src = resolvePath(locationOfRepo, 'raspberry-pi-camera', 'node_modules')
	const dest = resolvePath(locationOfRepo, 'raspberry-pi-camera', 'dist', 'node_modules')
	return readDirectory({ locationOfRepo })
	.then(({
		assetsLocation,
		files
	}) => moveFolder({ src, dest, assetsLocation, files }))
	.then(({
		assetsLocation,
		files
	}) => zipDirectory({ assetsLocation, files, locationOfRepo, version }))
	.then(({
		files
	}) => createOpts({ version, files, githubUser }))
	.then(({
		opts
	}) => {
		console.log('opts', opts)
		return publishRelease(opts, (err, release) => {
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
			console.log('RELEASE CREATED', release)
			resolve({ version })
		})
	})
})

export const readDirectory = ({
	locationOfRepo
}) => new Promise((resolve, reject) => {
	const assetsLocation = resolvePath(
		locationOfRepo,
		'raspberry-pi-camera',
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
	version
}) => new Promise((resolve, reject) => {
	console.log('ASSETSLOCATION', assetsLocation)
	return zipdir(assetsLocation, { saveTo: resolvePath(assetsLocation, '../', `raspberry-pi-camera-${version}.zip`) }, function (err, buffer) {
		if (err) {
			console.log('zipDirectory err', err)
			return
		}
		console.log('Finishing zipping directory')
		return resolve({
			assetsLocation,
			files: [
				resolvePath(assetsLocation, '../', `raspberry-pi-camera-${version}.zip`)
			]
		})
	})
})

const createOpts = ({
	version,
	files,
	githubUser
}) => {
	return Promise.resolve({
		opts: {
		  token: process.env.GITHUB_OAUTH_TOKEN,
		  owner: githubUser,
		  repo: 'raspberry-pi-camera',
		  tag: version,
		  name: 'Raspberry Pi Camera',
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
	moveSync(src, dest)
	return resolve({
		assetsLocation,
		files
	})
})
