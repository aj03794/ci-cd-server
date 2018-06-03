require('dotenv').config()

import { resolve as resolvePath } from 'path'

import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { init } from './server'

init({
	redis,
	slackCreator
})
