require('dotenv').config()

import { resolve as resolvePath } from 'path'

console.log('hello')

import { redis } from './pubsub/redis'
import { slack as slackCreator } from './slack'
import { init } from './server'
import { exposePort } from './expose-port'
init({
	redis,
	slackCreator
})
