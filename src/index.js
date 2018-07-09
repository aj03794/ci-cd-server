require('dotenv').config()

import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { init } from './server'
import { loggerCreator } from './logger'

const { publisherCreator, subscriberCreator } = redis({
	host: process.env[2] === 'dev' ? '127.0.0.1' : 'main.local'
})

Promise.all([
	publisherCreator(),
	subscriberCreator()
])
.then(([
	{ publish },
	{ subscribe }
]) => {

	const logger = loggerCreator({ publish })
	const slack = slackCreator({ publish })

	init({
		publish,
		slackCreator,
		logger
	})
})

