require('dotenv').config()

import { redis } from './pubsub/redis'
import { gcp } from './pubsub/gcp'
// import { slack as slackCreator } from './slack'
import { init } from './server'
import { loggerCreator } from './logger'
import { initalizeGithubListener } from './subscriptions'
import { getSetting } from './settings'

    const { publisherCreator, subscriberCreator } = redis({
        host: process.argv[2] === 'dev' ? '127.0.0.1' : 'main.local'
    })

    const uuid = process.env.UUID || 'dev'

    Promise.all([
        publisherCreator(),
        subscriberCreator(),
        gcp({ getSetting, uuid }),
    ])
    .then(([
        { publish },
        { subscribe },
        { allGcpMsgs, filterGcpMsgs },
    ]) => {
        // const slack = createSlack({ publish })
        const gcpFunctions = {
            allGcpMsgs,
            filterGcpMsgs,
        }


        const pubsubFunctions = {
            publish,
            subscribe
        }
        filterGcpMsgs(msg => console.log('-------->', msg))

        const logger = loggerCreator({ publish, appName: 'continuous-integration' })

        initalizeGithubListener({ filterGcpMsgs, logger })
       
    })
// })

