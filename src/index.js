require('dotenv').config()

import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { init } from './server'
import { gcp } from './pubsub/gcp'
import { getSetting } from './settings'


const { publisherCreator, subscriberCreator } = redis()
Promise.all([
	publisherCreator(),
	subscriberCreator(),
	gcp({ getSetting })
])
.then(([
	{ publish },
	{ subscribe }
]) => {
	// init({
	// 	publish,
	// 	slackCreator
	// })
})

