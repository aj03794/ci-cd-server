// const publishRelease = require('publish-release')
import publishRelease from 'publish-release'
import { resolve as resolvePath } from 'path'
import { readdir as readDir } from 'fs-extra'
import zipdir from 'zip-dir'


export const publishGithubArtifact = ({
	data
}) => new Promise((resolve, reject) => {
	console.log('Creating github release')
	const { locationOfRepo } = data
	return readDirectory({ locationOfRepo })
	.then(({
		assetsLocation,
		files
	}) => zipDirectory({ assetsLocation, files, locationOfRepo }))
	.then(({
		files
	}) => createOpts({ files }))
	// .then(console.log)
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
			resolve()
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
	locationOfRepo
}) => new Promise((resolve, reject) => {
	console.log('ASSETSLOCATION', assetsLocation)
	return zipdir(assetsLocation, { saveTo: resolvePath(assetsLocation, '../', 'dist.zip') }, function (err, buffer) {
		if (err) {
			console.log('zipDirectory err', err)
			return
		}
		console.log('Finishing zipping directory')
		return resolve({
			assetsLocation,
			files: [resolvePath(assetsLocation, '../', 'dist.zip')]
		})
	});
})

const createOpts = ({ files }) => {
	return Promise.resolve({
		opts: {
		  token: process.env.GITHUB_OAUTH_TOKEN,
		  owner: process.env.GITHUB_REPO_OWNER,
		  repo: 'raspberry-pi-camera',
			// body: 'my description'
		  tag: 'v1.0.10',
		  name: 'v1.0.10',
		  notes: 'very good!',
		  draft: false,
		  prerelease: false,
		  reuseRelease: true,
		  reuseDraftOnly: true,
		  skipAssetsCheck: false,
		  skipDuplicatedAssets: false,
		  editRelease: false,
		  deleteEmptyTag: false,
		  // assets: ['/absolute/path/to/file'],
			assets: files,
		  // apiUrl: 'https://api.github.com',
		  target_commitish: 'master'
		}
	})
}
