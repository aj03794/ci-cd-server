require('dotenv').config()

import { resolve as resolvePath } from 'path'

import { redis } from './pubsub/redis'
import { init } from './server'
import { exposePort } from './expose-port'

// const locationOfRepo = resolvePath(process.env.DIRECTORY_TO_SAVE_REPOS)
// console.log('locationOfRepo', locationOfRepo)

init({
	redis
})
.then(exposePort)
