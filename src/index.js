require('dotenv').config()

import { init } from './server'
import { exposePort } from './expose-port'

init()
.then(exposePort)
