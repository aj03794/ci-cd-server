// require('dotenv').config()

// import { redis } from './pubsub/redis'
// import { slack as slackCreator } from './slack'
// import { init } from './server'
// import { loggerCreator } from './logger'
// import { initalizeGithubListener } from './subscriptions'
import { getSetting } from './settings'

// const pubSubProviders = getSetting('pubsub')

const pubSubProvidersImports = getSetting('pubsub').map(pubSubProviders => {
	return import(`./pubsub/${pubSubProviders}`)
})
console.log(pubSubProvidersImports)

Promise.all(pubSubProvidersImports)
.then(pubSubProviders => {

	const x = pubSubProviders.reduce((accumulator, pubSubProvider) => {
        console.log('acc', accumulator)
        pubSubProvider.keys().forEach(key => { ...ac })
		return { ...accumulator, pubSubProvider }
	}, {})
	console.log('x', x)

    // const { publisherCreator, subscriberCreator } = redis({
    //     host: process.argv[2] === 'dev' ? '127.0.0.1' : 'main.local'
    // })
    // return Promise.all([
    //     publisherCreator(),
    //     subscriberCreator(),
    //     gcp({ getSetting, uuid }),
    //     queueCreator()
    // ])
    // .then(([
    //     { publish },
    //     { subscribe },
    //     { allGcpMsgs, filterGcpMsgs },
    //     { enqueue }
    // ]) => {
    //     const slack = createSlack({ publish })
    //     const gcpFunctions = {
    //         allGcpMsgs,
    //         filterGcpMsgs,
    //     }
    //     const pubsubFunctions = {
    //         publish,
    //         subscribe
    //     }
    //     return camera({
    //         ...pubsubFunctions,
    //         getSetting,
    //         slack,
    //         manageFolder,
    //         ...gcpFunctions,
    //         enqueue
    //     })
    // })
})

