require('dotenv').config()

import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { init } from './server'


const { publisherCreator, subscriberCreator } = redis()
Promise.all([
	publisherCreator(),
	subscriberCreator()
])
.then(([
	{ publish },
	{ subscribe }
]) => {
	init({
		publish,
		slackCreator
	})
})

